-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create updated function with better error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_full_name TEXT;
    v_phone_number TEXT;
    v_avatar_url TEXT;
BEGIN
    -- Extract metadata with proper error handling
    v_full_name := COALESCE(new.raw_user_meta_data->>'full_name', '');
    v_phone_number := COALESCE(new.raw_user_meta_data->>'phone_number', NULL);
    v_avatar_url := COALESCE(new.raw_user_meta_data->>'avatar_url', NULL);

    -- Insert into profiles with error handling
    BEGIN
        INSERT INTO public.profiles (
            id,
            full_name,
            phone_number,
            avatar_url
        ) VALUES (
            new.id,
            v_full_name,
            v_phone_number,
            v_avatar_url
        );
    EXCEPTION WHEN OTHERS THEN
        RAISE LOG 'Error creating profile: %', SQLERRM;
        RETURN new;
    END;

    -- Insert into notification_settings with error handling
    BEGIN
        INSERT INTO notification_settings (user_id)
        VALUES (new.id);
    EXCEPTION WHEN OTHERS THEN
        RAISE LOG 'Error creating notification settings: %', SQLERRM;
        RETURN new;
    END;

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION handle_new_user() TO postgres, anon, authenticated, service_role;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user(); 