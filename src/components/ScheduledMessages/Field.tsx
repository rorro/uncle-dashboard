import { faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChangeEvent, MouseEvent } from 'react';
import { APIEmbedField } from 'discord.js';

interface IProps {
  field: APIEmbedField;
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
        defaultValue={field.name}
        placeholder={'Field name'}
        name={'field name'}
        onChange={e => handleChangeField(messageId, e)}
      />
      <textarea
        className="input"
        defaultValue={field.value}
        placeholder={'Field value'}
        name={'field value'}
        onChange={e => handleChangeField(messageId, e)}
      />
      <br />
      <label className="inline">
        <input
          type="checkbox"
          className="checkbox"
          defaultChecked={field.inline}
          name={'field inline'}
          onChange={e => handleChangeField(messageId, e)}
        />
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
