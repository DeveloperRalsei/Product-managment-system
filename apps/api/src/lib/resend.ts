import { Resend } from "resend";

if (!process.env.RESEND_KEY) throw new Error("RESEND_KEY is undefined");

export default new Resend(process.env.RESEND_KEY);
