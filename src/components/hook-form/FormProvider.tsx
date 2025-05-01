// form
import { FormProvider as Form } from "react-hook-form";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
  methods: any;
  onSubmit?: VoidFunction;
  className?: string;
};

export default function FormProvider({
  children,
  onSubmit,
  methods,
  className = "",
}: Props) {
  return (
    <Form {...methods}>
      <form onSubmit={onSubmit} className={className}>
        {children}
      </form>
    </Form>
  );
}
