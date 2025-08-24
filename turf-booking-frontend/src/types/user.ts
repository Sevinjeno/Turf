export type User={
created_at:string;
email:string;
id:number;
is_verified:boolean;
name  :string;
otp :number;
password  :string;
phone :string;
role  :string; // Assuming role is a string, adjust if it's an enum or different type
verification_method :string;
}