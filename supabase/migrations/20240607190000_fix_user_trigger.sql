-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create updated function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert into profiles with COALESCE to handle null values
    INSERT INTO public.profiles (
        id,
        full_name,
        phone_number,
        avatar_url
    ) VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', ''),
        COALESCE(new.raw_user_meta_data->>'phone_number', NULL),
        COALESCE(new.raw_user_meta_data->>'avatar_url', NULL)
    );

    -- Insert into notification_settings
    INSERT INTO notification_settings (user_id)
    VALUES (new.id);

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user(); 