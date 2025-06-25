-- Validation function for vital signs
CREATE OR REPLACE FUNCTION validate_vitals_data()
RETURNS TRIGGER AS $$
BEGIN
    -- Validate blood pressure
    IF NEW.systolic_bp IS NOT NULL AND (NEW.systolic_bp < 70 OR NEW.systolic_bp > 300) THEN
        RAISE EXCEPTION 'Invalid systolic blood pressure: %', NEW.systolic_bp;
    END IF;
    
    IF NEW.diastolic_bp IS NOT NULL AND (NEW.diastolic_bp < 40 OR NEW.diastolic_bp > 200) THEN
        RAISE EXCEPTION 'Invalid diastolic blood pressure: %', NEW.diastolic_bp;
    END IF;
    
    -- Validate heart rate
    IF NEW.heart_rate IS NOT NULL AND (NEW.heart_rate < 30 OR NEW.heart_rate > 250) THEN
        RAISE EXCEPTION 'Invalid heart rate: %', NEW.heart_rate;
    END IF;
    
    -- Validate temperature (in Celsius)
    IF NEW.temperature IS NOT NULL AND (NEW.temperature < 30.0 OR NEW.temperature > 45.0) THEN
        RAISE EXCEPTION 'Invalid temperature: %', NEW.temperature;
    END IF;
    
    -- Validate weight (in kg)
    IF NEW.weight IS NOT NULL AND (NEW.weight < 0.5 OR NEW.weight > 1000) THEN
        RAISE EXCEPTION 'Invalid weight: %', NEW.weight;
    END IF;
    
    -- Validate height (in cm)
    IF NEW.height IS NOT NULL AND (NEW.height < 30 OR NEW.height > 300) THEN
        RAISE EXCEPTION 'Invalid height: %', NEW.height;
    END IF;
    
    -- Calculate BMI if both weight and height are provided
    IF NEW.weight IS NOT NULL AND NEW.height IS NOT NULL THEN
        NEW.bmi = NEW.weight / POWER(NEW.height / 100.0, 2);
    END IF;
    
    -- Validate oxygen saturation
    IF NEW.oxygen_saturation IS NOT NULL AND (NEW.oxygen_saturation < 70 OR NEW.oxygen_saturation > 100) THEN
        RAISE EXCEPTION 'Invalid oxygen saturation: %', NEW.oxygen_saturation;
    END IF;
    
    -- Validate blood glucose (mg/dL)
    IF NEW.blood_glucose IS NOT NULL AND (NEW.blood_glucose < 20 OR NEW.blood_glucose > 800) THEN
        RAISE EXCEPTION 'Invalid blood glucose: %', NEW.blood_glucose;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply validation trigger
CREATE TRIGGER validate_vitals_data_trigger
    BEFORE INSERT OR UPDATE ON vitals_data
    FOR EACH ROW EXECUTE FUNCTION validate_vitals_data();

-- Validation function for user data
CREATE OR REPLACE FUNCTION validate_user_data()
RETURNS TRIGGER AS $$
BEGIN
    -- Validate email format
    IF NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        RAISE EXCEPTION 'Invalid email format: %', NEW.email;
    END IF;
    
    -- Validate phone format (basic validation)
    IF NEW.phone IS NOT NULL AND NEW.phone !~ '^\+?[1-9]\d{1,14}$' THEN
        RAISE EXCEPTION 'Invalid phone format: %', NEW.phone;
    END IF;
    
    -- Validate date of birth (not in future, not too old)
    IF NEW.date_of_birth IS NOT NULL THEN
        IF NEW.date_of_birth > CURRENT_DATE THEN
            RAISE EXCEPTION 'Date of birth cannot be in the future';
        END IF;
        
        IF NEW.date_of_birth < CURRENT_DATE - INTERVAL '150 years' THEN
            RAISE EXCEPTION 'Date of birth cannot be more than 150 years ago';
        END IF;
    END IF;
    
    -- Validate doctor-specific fields
    IF NEW.role = 'doctor' THEN
        IF NEW.license_number IS NULL OR LENGTH(NEW.license_number) < 5 THEN
            RAISE EXCEPTION 'Doctor must have a valid license number';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply user validation trigger
CREATE TRIGGER validate_user_data_trigger
    BEFORE INSERT OR UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION validate_user_data();

-- Function to prevent circular family connections
CREATE OR REPLACE FUNCTION prevent_circular_connections()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if this would create a circular connection
    IF EXISTS (
        SELECT 1 FROM family_connections 
        WHERE user_id = NEW.connected_user_id 
        AND connected_user_id = NEW.user_id
    ) THEN
        RAISE EXCEPTION 'Circular family connection not allowed';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply circular connection prevention trigger
CREATE TRIGGER prevent_circular_connections_trigger
    BEFORE INSERT ON family_connections
    FOR EACH ROW EXECUTE FUNCTION prevent_circular_connections();

-- Function to validate health insight scores
CREATE OR REPLACE FUNCTION validate_health_insights()
RETURNS TRIGGER AS $$
BEGIN
    -- Validate risk score range
    IF NEW.risk_score IS NOT NULL AND (NEW.risk_score < 0 OR NEW.risk_score > 1) THEN
        RAISE EXCEPTION 'Risk score must be between 0 and 1: %', NEW.risk_score;
    END IF;
    
    -- Validate confidence level range
    IF NEW.confidence_level IS NOT NULL AND (NEW.confidence_level < 0 OR NEW.confidence_level > 1) THEN
        RAISE EXCEPTION 'Confidence level must be between 0 and 1: %', NEW.confidence_level;
    END IF;
    
    -- Validate progress percentage
    IF NEW.progress_percentage IS NOT NULL AND (NEW.progress_percentage < -100 OR NEW.progress_percentage > 1000) THEN
        RAISE EXCEPTION 'Progress percentage out of reasonable range: %', NEW.progress_percentage;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply health insights validation trigger
CREATE TRIGGER validate_health_insights_trigger
    BEFORE INSERT OR UPDATE ON health_insights
    FOR EACH ROW EXECUTE FUNCTION validate_health_insights();
