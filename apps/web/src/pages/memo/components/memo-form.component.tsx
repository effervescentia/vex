import { useConst } from '@bltx/web';
import { fieldAtom, formAtom, useForm, useTextareaField } from 'form-atoms';

export interface MemoFormValue {
  content: string;
}

export interface MemoFormProps {
  initialValue: MemoFormValue;
  submitLabel: string;
  onSubmit: (value: MemoFormValue) => void;
}

export const MemoForm: React.FC<MemoFormProps> = ({ initialValue, submitLabel, onSubmit }) => {
  const memoFormAtom = useConst(() =>
    formAtom({
      content: fieldAtom({ value: initialValue.content }),
    }),
  );
  const { fieldAtoms, submit } = useForm(memoFormAtom);
  const contentField = useTextareaField(fieldAtoms.content);

  return (
    <form onSubmit={submit(onSubmit)}>
      <textarea {...contentField.props} />
      <button type="submit">{submitLabel}</button>
    </form>
  );
};
