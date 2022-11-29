import { faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChangeEvent, MouseEvent } from 'react';
import { ExtendedAPIEmbedField } from '../../types';

interface IProps {
  field: ExtendedAPIEmbedField;
  messageId: number;
  handleRemoveField: (messageId: number, e: MouseEvent<HTMLLabelElement>) => void;
  handleChangeField: (messageId: number, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

function Field({ field, messageId, handleRemoveField, handleChangeField }: IProps) {
  return (
    <div className="field">
      <input
        type="text"
        className="input"
        defaultValue={field.name.toString()}
        placeholder={'Field name'}
        name={'fields name'}
        maxLength={256}
        onChange={e => handleChangeField(messageId, e)}
      />
      <textarea
        className="input"
        defaultValue={field.value.toString()}
        placeholder={'Field value'}
        name={'fields value'}
        maxLength={1024}
        onChange={e => handleChangeField(messageId, e)}
      />
      <br />
      <input
        type="checkbox"
        className="checkbox"
        defaultChecked={field.inline}
        name={'fields inline'}
        onChange={e => handleChangeField(messageId, e)}
      />
      <label htmlFor="fields inline" className="inline">
        Inline
      </label>

      <label onClick={e => handleRemoveField(messageId, e)}>
        <FontAwesomeIcon icon={faRemove} className="margin" />
        Remove
      </label>
    </div>
  );
}

export default Field;
