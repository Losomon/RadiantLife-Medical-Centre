-- ============================================================
--  MediCore HMS — Patient Registration Database Schema
--  Phase 1 Foundation: Patients, Contacts, Insurance, History
--  Compatible with: PostgreSQL 14+
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
--  LOOKUP / REFERENCE TABLES
-- ============================================================

CREATE TABLE blood_groups (
    id          SMALLINT PRIMARY KEY,
    code        VARCHAR(4) NOT NULL UNIQUE  -- e.g. 'A+', 'O-', 'AB+'
);
INSERT INTO blood_groups VALUES (1,'A+'),(2,'A-'),(3,'B+'),(4,'B-'),
  (5,'AB+'),(6,'AB-'),(7,'O+'),(8,'O-'),(9,'Unknown');

CREATE TABLE counties (
    id          SMALLINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name        VARCHAR(100) NOT NULL,
    code        VARCHAR(10)
);

CREATE TABLE insurance_providers (
    id          SMALLINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name        VARCHAR(150) NOT NULL,
    code        VARCHAR(20),
    phone       VARCHAR(20),
    email       VARCHAR(120),
    is_active   BOOLEAN DEFAULT TRUE
);

-- ============================================================
--  CORE PATIENT TABLE
-- ============================================================

CREATE TABLE patients (
    -- Primary key
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_number      VARCHAR(20) NOT NULL UNIQUE,   -- e.g. PRG-2026-0291 (auto-generated)

    -- Personal details
    title               VARCHAR(10),                   -- Mr, Mrs, Dr, Prof
    first_name          VARCHAR(100) NOT NULL,
    middle_name         VARCHAR(100),
    last_name           VARCHAR(100) NOT NULL,
    preferred_name      VARCHAR(100),                  -- Nickname / what they prefer

    -- Date of birth & age
    date_of_birth       DATE NOT NULL,
    age_years           SMALLINT GENERATED ALWAYS AS
                            (DATE_PART('year', AGE(date_of_birth))::SMALLINT) STORED,

    -- Sex & gender
    sex_at_birth        VARCHAR(10) NOT NULL            -- 'Male', 'Female', 'Intersex'
                            CHECK (sex_at_birth IN ('Male','Female','Intersex')),
    gender_identity     VARCHAR(50),
    pronoun             VARCHAR(30),

    -- Civil status
    marital_status      VARCHAR(20)
                            CHECK (marital_status IN ('Single','Married','Divorced','Widowed','Separated')),
    nationality         VARCHAR(80),
    religion            VARCHAR(60),
    occupation          VARCHAR(120),

    -- Identification
    id_type             VARCHAR(30),                   -- 'National ID', 'Passport', etc.
    id_number           VARCHAR(50) UNIQUE,
    kra_pin             VARCHAR(20),
    passport_number     VARCHAR(30),

    -- Clinical basics
    blood_group_id      SMALLINT REFERENCES blood_groups(id),
    photo_url           TEXT,                          -- S3 / storage URL

    -- Disability & special needs
    has_disability      BOOLEAN DEFAULT FALSE,
    disability_notes    TEXT,

    -- Patient status
    is_active           BOOLEAN DEFAULT TRUE,
    is_deceased         BOOLEAN DEFAULT FALSE,
    date_of_death       DATE,
    cause_of_death      TEXT,

    -- Registration metadata
    registered_by       UUID,                          -- FK to staff table (Phase 2)
    registration_date   TIMESTAMPTZ DEFAULT NOW(),
    last_visit_date     DATE,
    source              VARCHAR(30) DEFAULT 'walk-in', -- 'walk-in', 'referral', 'transfer', 'online'
    referral_source     VARCHAR(150),

    -- Timestamps
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_patients_number      ON patients(patient_number);
CREATE INDEX idx_patients_name        ON patients(last_name, first_name);
CREATE INDEX idx_patients_dob         ON patients(date_of_birth);
CREATE INDEX idx_patients_id_number   ON patients(id_number);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_patients_updated
    BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-generate patient number: PRG-YYYY-NNNN
CREATE SEQUENCE patient_seq START 1;
CREATE OR REPLACE FUNCTION generate_patient_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.patient_number IS NULL OR NEW.patient_number = '' THEN
        NEW.patient_number := 'PRG-' || TO_CHAR(NOW(), 'YYYY') || '-'
                              || LPAD(NEXTVAL('patient_seq')::TEXT, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_patient_number
    BEFORE INSERT ON patients
    FOR EACH ROW EXECUTE FUNCTION generate_patient_number();


-- ============================================================
--  CONTACT DETAILS
-- ============================================================

CREATE TABLE patient_contacts (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id          UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,

    -- Phone numbers
    primary_phone       VARCHAR(20) NOT NULL,
    secondary_phone     VARCHAR(20),
    whatsapp_number     VARCHAR(20),

    -- Email
    email               VARCHAR(150),

    -- Preferred contact
    preferred_method    VARCHAR(20) DEFAULT 'phone'
                            CHECK (preferred_method IN ('phone','sms','email','whatsapp')),

    -- Residential address
    street_address      TEXT,
    estate_name         VARCHAR(150),
    town_city           VARCHAR(100),
    county_id           SMALLINT REFERENCES counties(id),
    postal_code         VARCHAR(20),
    country             VARCHAR(80) DEFAULT 'Kenya',
    latitude            NUMERIC(9,6),   -- GPS for home visits
    longitude           NUMERIC(9,6),

    -- Consents
    consent_sms         BOOLEAN DEFAULT FALSE,
    consent_email       BOOLEAN DEFAULT FALSE,
    consent_share_records BOOLEAN DEFAULT FALSE,
    consent_research    BOOLEAN DEFAULT FALSE,

    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contacts_patient  ON patient_contacts(patient_id);
CREATE INDEX idx_contacts_phone    ON patient_contacts(primary_phone);

CREATE TRIGGER trg_contacts_updated
    BEFORE UPDATE ON patient_contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================
--  EMERGENCY CONTACTS
-- ============================================================

CREATE TABLE emergency_contacts (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id          UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,

    priority            SMALLINT NOT NULL DEFAULT 1,   -- 1 = primary, 2 = secondary
    full_name           VARCHAR(150) NOT NULL,
    relationship        VARCHAR(50) NOT NULL,           -- 'Spouse', 'Parent', 'Child', 'Guardian'...
    phone_primary       VARCHAR(20) NOT NULL,
    phone_secondary     VARCHAR(20),
    email               VARCHAR(150),
    address             TEXT,                           -- if different from patient

    -- Legal / guardianship
    is_legal_guardian   BOOLEAN DEFAULT FALSE,
    is_next_of_kin      BOOLEAN DEFAULT FALSE,
    is_power_of_attorney BOOLEAN DEFAULT FALSE,

    notes               TEXT,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_emergency_patient ON emergency_contacts(patient_id);

CREATE TRIGGER trg_emergency_updated
    BEFORE UPDATE ON emergency_contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================
--  INSURANCE / BILLING
-- ============================================================

CREATE TABLE patient_insurance (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id              UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    provider_id             SMALLINT REFERENCES insurance_providers(id),

    cover_type              VARCHAR(20) NOT NULL
                                CHECK (cover_type IN ('NHIF','Private','Corporate','Self-pay')),
    policy_number           VARCHAR(80),
    scheme_name             VARCHAR(150),               -- Corporate scheme name

    -- Principal member (may differ from patient)
    principal_name          VARCHAR(150),
    principal_relationship  VARCHAR(50),                -- 'Self', 'Spouse', 'Parent'...

    -- Cover dates
    start_date              DATE,
    expiry_date             DATE,

    -- Financials
    cover_limit_kes         NUMERIC(12,2),
    copay_amount_kes        NUMERIC(10,2),
    excess_amount_kes       NUMERIC(10,2),

    -- Priority (1 = primary cover)
    priority                SMALLINT DEFAULT 1,
    is_active               BOOLEAN DEFAULT TRUE,

    notes                   TEXT,
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_insurance_patient  ON patient_insurance(patient_id);
CREATE INDEX idx_insurance_policy   ON patient_insurance(policy_number);

CREATE TRIGGER trg_insurance_updated
    BEFORE UPDATE ON patient_insurance
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================
--  MEDICAL HISTORY — CONDITIONS
-- ============================================================

CREATE TABLE conditions_catalogue (
    id          SMALLINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name        VARCHAR(150) NOT NULL,
    icd10_code  VARCHAR(10),                           -- International coding
    category    VARCHAR(60)                            -- 'Chronic', 'Acute', 'Mental'...
);

-- Pre-load common conditions
INSERT INTO conditions_catalogue (name, icd10_code, category) VALUES
  ('Diabetes mellitus type 2', 'E11', 'Chronic'),
  ('Hypertension', 'I10', 'Chronic'),
  ('Asthma', 'J45', 'Chronic'),
  ('HIV/AIDS', 'B24', 'Chronic'),
  ('Tuberculosis', 'A15', 'Infectious'),
  ('Heart disease', 'I25', 'Chronic'),
  ('Chronic kidney disease', 'N18', 'Chronic'),
  ('Cancer', 'C80', 'Oncology'),
  ('Epilepsy', 'G40', 'Neurological'),
  ('Thyroid disorder', 'E07', 'Endocrine'),
  ('Mental health disorder', 'F99', 'Mental health');

CREATE TABLE patient_conditions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id      UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    condition_id    SMALLINT REFERENCES conditions_catalogue(id),
    condition_name  VARCHAR(150),                      -- Fallback for unlisted conditions
    onset_date      DATE,
    status          VARCHAR(20) DEFAULT 'Active'
                        CHECK (status IN ('Active','Resolved','In remission','Suspected')),
    severity        VARCHAR(20)
                        CHECK (severity IN ('Mild','Moderate','Severe')),
    notes           TEXT,
    recorded_by     UUID,                              -- FK to staff
    recorded_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_conditions_patient ON patient_conditions(patient_id);


-- ============================================================
--  MEDICAL HISTORY — ALLERGIES
-- ============================================================

CREATE TABLE patient_allergies (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id      UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    allergen_type   VARCHAR(30) DEFAULT 'Drug'
                        CHECK (allergen_type IN ('Drug','Food','Environmental','Contrast','Latex','Other')),
    allergen_name   VARCHAR(150) NOT NULL,
    reaction        TEXT NOT NULL,                     -- e.g. 'Anaphylaxis', 'Rash', 'Swelling'
    severity        VARCHAR(20) DEFAULT 'Moderate'
                        CHECK (severity IN ('Mild','Moderate','Severe','Life-threatening')),
    onset_date      DATE,
    is_confirmed    BOOLEAN DEFAULT TRUE,
    notes           TEXT,
    recorded_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_allergies_patient ON patient_allergies(patient_id);


-- ============================================================
--  MEDICAL HISTORY — CURRENT MEDICATIONS
-- ============================================================

CREATE TABLE patient_medications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id      UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    drug_name       VARCHAR(150) NOT NULL,
    dosage          VARCHAR(80),                       -- e.g. '500mg'
    frequency       VARCHAR(80),                       -- e.g. 'Twice daily'
    route           VARCHAR(40),                       -- 'Oral', 'IV', 'Topical'
    start_date      DATE,
    end_date        DATE,
    prescribed_by   VARCHAR(150),                      -- External doctor name
    is_current      BOOLEAN DEFAULT TRUE,
    reason          TEXT,
    notes           TEXT,
    recorded_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_medications_patient ON patient_medications(patient_id);


-- ============================================================
--  MEDICAL HISTORY — SURGICAL HISTORY
-- ============================================================

CREATE TABLE patient_surgeries (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id      UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    procedure_name  VARCHAR(200) NOT NULL,
    hospital        VARCHAR(150),
    surgeon         VARCHAR(150),
    surgery_date    DATE,
    outcome         TEXT,
    complications   TEXT,
    notes           TEXT,
    recorded_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_surgeries_patient ON patient_surgeries(patient_id);


-- ============================================================
--  MEDICAL HISTORY — FAMILY HISTORY
-- ============================================================

CREATE TABLE patient_family_history (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id      UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    relationship    VARCHAR(50),                       -- 'Father', 'Mother', 'Sibling'
    condition_name  VARCHAR(150) NOT NULL,
    condition_id    SMALLINT REFERENCES conditions_catalogue(id),
    notes           TEXT,
    recorded_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_family_history_patient ON patient_family_history(patient_id);


-- ============================================================
--  LIFESTYLE / SOCIAL HISTORY
-- ============================================================

CREATE TABLE patient_lifestyle (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id          UUID NOT NULL UNIQUE REFERENCES patients(id) ON DELETE CASCADE,

    smoking_status      VARCHAR(20)
                            CHECK (smoking_status IN ('Never','Former','Current')),
    cigarettes_per_day  SMALLINT,
    smoking_quit_year   SMALLINT,

    alcohol_use         VARCHAR(20)
                            CHECK (alcohol_use IN ('None','Occasional','Moderate','Heavy')),
    alcohol_units_weekly SMALLINT,

    drug_use            BOOLEAN DEFAULT FALSE,
    drug_use_notes      TEXT,

    exercise_level      VARCHAR(20)
                            CHECK (exercise_level IN ('Sedentary','Light','Moderate','Active')),

    dietary_requirements TEXT,                         -- e.g. 'Diabetic diet, no pork'
    bmi_at_registration NUMERIC(4,1),
    height_cm           SMALLINT,
    weight_kg           NUMERIC(5,1),

    additional_notes    TEXT,
    recorded_at         TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_lifestyle_updated
    BEFORE UPDATE ON patient_lifestyle
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================
--  AUDIT LOG — Track all changes to patient records
-- ============================================================

CREATE TABLE patient_audit_log (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id  UUID NOT NULL,
    table_name  VARCHAR(80) NOT NULL,
    action      VARCHAR(10) NOT NULL CHECK (action IN ('INSERT','UPDATE','DELETE')),
    changed_by  UUID,                                  -- FK to staff table
    changed_at  TIMESTAMPTZ DEFAULT NOW(),
    old_values  JSONB,
    new_values  JSONB,
    ip_address  INET,
    notes       TEXT
);

CREATE INDEX idx_audit_patient   ON patient_audit_log(patient_id);
CREATE INDEX idx_audit_table     ON patient_audit_log(table_name);
CREATE INDEX idx_audit_changed   ON patient_audit_log(changed_at DESC);


-- ============================================================
--  CONVENIENCE VIEW — Full patient summary
-- ============================================================

CREATE VIEW v_patient_summary AS
SELECT
    p.id,
    p.patient_number,
    p.title || ' ' || p.first_name || ' ' || p.last_name AS full_name,
    p.preferred_name,
    p.date_of_birth,
    p.age_years,
    p.sex_at_birth,
    p.gender_identity,
    p.marital_status,
    p.nationality,
    bg.code AS blood_group,
    p.id_type,
    p.id_number,
    p.occupation,
    p.is_active,
    p.registration_date,

    -- Contact
    c.primary_phone,
    c.email,
    c.town_city,
    c.country,
    c.preferred_method,

    -- Emergency contact (primary)
    ec.full_name         AS emergency_contact_name,
    ec.relationship      AS emergency_contact_relationship,
    ec.phone_primary     AS emergency_contact_phone,

    -- Insurance (primary)
    pi.cover_type,
    ip.name              AS insurance_provider,
    pi.policy_number,
    pi.expiry_date       AS insurance_expiry,

    -- Counts
    (SELECT COUNT(*) FROM patient_conditions  WHERE patient_id = p.id AND status = 'Active') AS active_conditions,
    (SELECT COUNT(*) FROM patient_allergies   WHERE patient_id = p.id)                        AS allergy_count,
    (SELECT COUNT(*) FROM patient_medications WHERE patient_id = p.id AND is_current = TRUE)  AS current_meds

FROM patients p
LEFT JOIN blood_groups       bg ON bg.id  = p.blood_group_id
LEFT JOIN patient_contacts   c  ON c.patient_id  = p.id
LEFT JOIN emergency_contacts ec ON ec.patient_id = p.id AND ec.priority = 1
LEFT JOIN patient_insurance  pi ON pi.patient_id = p.id AND pi.priority = 1 AND pi.is_active = TRUE
LEFT JOIN insurance_providers ip ON ip.id = pi.provider_id;


-- ============================================================
--  SEARCH FUNCTION — Find patient by name, ID or phone
-- ============================================================

CREATE OR REPLACE FUNCTION search_patients(search_term TEXT)
RETURNS TABLE (
    patient_id      UUID,
    patient_number  VARCHAR,
    full_name       TEXT,
    age_years       SMALLINT,
    primary_phone   VARCHAR,
    blood_group     VARCHAR,
    is_active       BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.patient_number,
        p.title || ' ' || p.first_name || ' ' || p.last_name,
        p.age_years,
        c.primary_phone,
        bg.code,
        p.is_active
    FROM patients p
    LEFT JOIN patient_contacts c  ON c.patient_id = p.id
    LEFT JOIN blood_groups     bg ON bg.id = p.blood_group_id
    WHERE
        p.patient_number ILIKE '%' || search_term || '%'
        OR p.first_name  ILIKE '%' || search_term || '%'
        OR p.last_name   ILIKE '%' || search_term || '%'
        OR p.id_number   ILIKE '%' || search_term || '%'
        OR c.primary_phone ILIKE '%' || search_term || '%'
    ORDER BY p.last_name, p.first_name
    LIMIT 50;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
--  TABLE SUMMARY
-- ============================================================
-- patients               — Core patient identity record
-- patient_contacts       — Phone, email, address, consents
-- emergency_contacts     — Emergency & next-of-kin details
-- patient_insurance      — Medical cover & billing info
-- patient_conditions     — Chronic & active diagnoses
-- patient_allergies      — Drug & food allergies
-- patient_medications    — Current & past medications
-- patient_surgeries      — Surgical / procedure history
-- patient_family_history — Hereditary conditions
-- patient_lifestyle      — Smoking, alcohol, BMI, diet
-- patient_audit_log      — Full change history (GDPR-ready)
-- v_patient_summary      — Convenience view for dashboards
-- search_patients()      — Full-text search function
-- ============================================================