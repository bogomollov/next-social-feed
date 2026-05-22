import { REGEXP_ONLY_DIGITS } from "input-otp";
import { IconRefresh } from "@tabler/icons-react";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/shared/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/shared/ui/input-otp";

type InputOTPFormProps = {
  title: string;
  description: string;
  email: string;
  label: string;
  resend: string;
  help: string;
  submit: string;
};

export function InputOTPForm({
  title,
  description,
  email,
  label,
  resend,
  help,
  submit,
}: InputOTPFormProps) {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description} <span className="font-medium text-foreground">{email}</span>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Field>
          <div className="flex items-center justify-between gap-3">
            <FieldLabel htmlFor="otp-verification">{label}</FieldLabel>
            <Button variant="outline" size="xs">
              <IconRefresh data-icon="inline-start" />
              {resend}
            </Button>
          </div>
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            id="otp-verification"
            required
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator className="mx-1" />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <FieldDescription>{help}</FieldDescription>
        </Field>
      </CardContent>
      <CardFooter>
        <Field className="w-full">
          <Button type="submit" className="w-full">
            {submit}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
