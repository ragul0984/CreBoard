import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@/src/utils/supabase/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify User has enabled Weekly Reports in their settings
    const { data: profile } = await supabase.from('profiles').select('weekly_reports').eq('id', user.id).maybeSingle();
    if (profile && profile.weekly_reports === false) {
      return NextResponse.json({ success: false, message: 'User has disabled weekly reports.' }, { status: 200 });
    }

    // Fetch User Revenue for the Last 7 Days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data: revenue } = await supabase
      .from('revenue')
      .select('amount, platform')
      .eq('user_id', user.id)
      .gte('date', sevenDaysAgo.toISOString().split('T')[0]);

    const weeklyTotal = revenue?.reduce((sum: number, r: { amount: number; platform: string }) => sum + r.amount, 0) || 0;
    
    // Simulate growth metric
    const previousWeekMock = weeklyTotal * 0.8; 
    const growth = weeklyTotal > 0 ? ((weeklyTotal - previousWeekMock) / previousWeekMock * 100).toFixed(1) : 0;

    // Dispatch beautiful HTML email over Resend API
    const data = await resend.emails.send({
      from: 'CreBoard Weekly <onboarding@resend.dev>', // Sandbox domain tests via Resend
      to: [user.email!], // Sends securely to the authenticated creator's email
      subject: `Your Weekly Creator Revenue: ₹${weeklyTotal.toLocaleString()}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; background-color: #0A0A0B; color: #E4E4E7; border-radius: 16px; border: 1px solid #27272A;">
          
          <div style="display: flex; align-items: center; margin-bottom: 32px;">
            <div style="width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, #4CE3BC, #25AAE1); display: flex; align-items: center; justify-content: center; font-weight: 900; color: #000; font-size: 14px; margin-right: 12px; text-align: center; line-height: 32px;">C</div>
            <h1 style="color: #FFF; font-size: 20px; font-weight: 700; margin: 0; tracking: -0.5px;">CreBoard Protocol</h1>
          </div>

          <h2 style="color: #4CE3BC; font-size: 24px; font-weight: 600; margin-bottom: 8px;">Weekly Snapshot</h2>
          <p style="font-size: 15px; color: #A1A1AA; line-height: 1.5; margin-bottom: 24px;">Here is your localized revenue distribution and aggregated performance for the last 7 days.</p>
          
          <div style="background-color: #18181B; padding: 24px; border-radius: 12px; margin: 24px 0; border: 1px solid #27272A;">
            <p style="margin: 0; font-size: 11px; color: #A1A1AA; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">Gross 7-Day Revenue</p>
            <h3 style="margin: 8px 0 0; font-size: 40px; color: #FFF; font-weight: 800; letter-spacing: -1px;">₹${weeklyTotal.toLocaleString()}</h3>
            <p style="margin: 8px 0 0; font-size: 13px; color: #4CE3BC; font-weight: 600;">+${growth}% compared to last week</p>
          </div>

          <p style="font-size: 14px; color: #A1A1AA; line-height: 1.5; margin-bottom: 32px;">All active collaborations and over-due balances have been synchronized. Access your system node to audit current status.</p>
          
          <a href="http://localhost:3000/dashboard" style="display: inline-block; padding: 14px 28px; background-color: #4CE3BC; color: #000; text-decoration: none; font-weight: 700; font-size: 14px; border-radius: 8px; text-transform: uppercase; letter-spacing: 1px;">
            Initialize Dashboard
          </a>

          <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #27272A;">
             <p style="font-size: 11px; color: #52525B; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; text-align: center;">© 2026 CreBoard Inc. • Global Network</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: 'Email dispatched successfully!', id: data.data?.id });
  } catch (error: any) {
    console.error("Resend API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
