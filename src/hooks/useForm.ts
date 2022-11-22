import { ChangeEvent, FormEvent, useState } from 'react';

export const useForm = <T>(callback: () => Promise<any>, initialState: T) => {
  const [valuesChanged, setValuesChanged] = useState<boolean>(false);
  const [values, setValues] = useState<T>(initialState);
  const [savedState, setSavedState] = useState<T>(initialState);

  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValues({ ...values, [event.target.name]: event.target.value });

    if (savedState[event.target.name as keyof T] !== event.target.value) {
      setValuesChanged(true);
    } else {
      setValuesChanged(false);
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValuesChanged(false);
    setSavedState(values);
    await callback();
  };

  // return values
  return {
    onChange,
    onSubmit,
    values,
    valuesChanged
  };
};
