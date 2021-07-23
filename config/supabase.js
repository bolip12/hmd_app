import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const supabase_url = 'https://boosiwjmzafecgvteifj.supabase.co';
const supabase_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyNjgzMDMyNCwiZXhwIjoxOTQyNDA2MzI0fQ.JyyCCGLE88767Xfq1-XTPOXJXkAGEDI0UuVeG8MEQhk';
const supabase = createClient(supabase_url, supabase_key, {
  localStorage: AsyncStorage,
});

export default supabase;


/*const supabase_url = "https://kpmpgopdpotxrurikwlw.supabase.co";
const supabase_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMDYyNDAyMSwiZXhwIjoxOTM2MjAwMDIxfQ.45dRMiW3hPcPG5We62K5Q48qc-GBMukPaThOWkOj7hs';*/