import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendEmail } from '@/lib/email/mailer';
import prisma from '@/lib/prisma';

const SubscribeSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const parsed = SubscribeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid email', issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    // Persist or reactivate subscriber in DB
    await prisma.subscriber.upsert({
      where: { email },
      update: { status: 'subscribed' },
      create: { email, status: 'subscribed' },
    });

    // Send confirmation email to subscriber
    const subject = 'Подтверждение подписки — Бухта пеликанов';
    const html = `
      <div style="font-family:Inter,Segoe UI,Arial,sans-serif;line-height:1.6;color:#111827">
        <h2 style="margin:0 0 12px">Спасибо за подписку!</h2>
        <p>Вы подписались на новости компании <strong>Бухта пеликанов</strong>.</p>
        <p>Если вы не оформляли подписку, просто проигнорируйте это письмо.</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0" />
        <p style="font-size:12px;color:#6b7280">Это автоматическое письмо, отвечать на него не нужно.</p>
      </div>
    `;

    await sendEmail({ to: email, subject, html });

    return NextResponse.json({ ok: true, message: 'Подписка оформлена' }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }
}
