import { faImage, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { APIEmbed } from 'discord.js';
import { ChangeEvent, FormEventHandler, MouseEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Collapsible from '../Collapsible';
import Field from './Field';

interface IProps {
  messageId: number;
  content: string;
  embed: APIEmbed;
  handleRemoveField: (messageId: number, e: MouseEvent<HTMLLabelElement>) => void;
  handleAddField: (messageId: number) => void;
  handleSubmit: FormEventHandler<HTMLFormElement>;
  handleChange: (messageId: number, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

function GUI({
  messageId,
  content,
  embed,
  handleRemoveField,
  handleAddField,
  handleSubmit,
  handleChange
}: IProps) {
  return (
    <form onSubmit={handleSubmit} className="gui">
      <Collapsible title="Message Content">
        <textarea
          className="input"
          defaultValue={content}
          placeholder={'Message content'}
          name="content"
          onChange={e => handleChange(messageId, e)}
        />
      </Collapsible>

      <Collapsible title="Author">
        <FontAwesomeIcon icon={faImage} className="icon" />
        <input
          type="text"
          className="input"
          defaultValue={embed.author?.icon_url}
          placeholder={`Icon URL`}
          name="author icon_url"
          onChange={e => handleChange(messageId, e)}
        />
        <input
          type="text"
          className="input"
          defaultValue={embed.author?.name}
          placeholder={'Author name'}
          name="author name"
          onChange={e => handleChange(messageId, e)}
        />
      </Collapsible>

      <Collapsible title={'Title'}>
        <input
          type="text"
          className="input"
          defaultValue={embed.title}
          placeholder={'Title'}
          name="title"
          onChange={e => handleChange(messageId, e)}
        />
      </Collapsible>

      <Collapsible title="Description">
        <textarea
          className="input"
          defaultValue={embed.description}
          placeholder={'Embed description'}
          name={'description'}
          onChange={e => handleChange(messageId, e)}
        />
      </Collapsible>

      <Collapsible title={'Fields'} id={messageId}>
        {embed.fields &&
          embed.fields.map(f => {
            return (
              <Field
                key={`${uuidv4()}`}
                field={f}
                messageId={messageId}
                handleRemoveField={handleRemoveField}
                handleChangeField={handleChange}
              />
            );
          })}
        <label className="add_field" onClick={() => handleAddField(messageId)}>
          Add field
          <FontAwesomeIcon icon={faPlusSquare} className="margin" />
        </label>
      </Collapsible>

      <Collapsible title={'Thumbnail'}>
        <FontAwesomeIcon icon={faImage} className="icon" />
        <input
          type="text"
          className="input"
          defaultValue={embed.thumbnail?.url}
          placeholder={'Thumbnail URL'}
          name={'thumbnail url'}
          onChange={e => handleChange(messageId, e)}
        />
      </Collapsible>

      <Collapsible title={'Image'}>
        <FontAwesomeIcon icon={faImage} className="icon" />
        <input
          type="text"
          className="input"
          defaultValue={embed.image?.url}
          placeholder={'Image URL'}
          name={'image url'}
          onChange={e => handleChange(messageId, e)}
        />
      </Collapsible>

      <Collapsible title="Footer">
        <FontAwesomeIcon icon={faImage} className="icon" />
        <input
          type="text"
          className="input"
          defaultValue={embed.footer?.icon_url}
          placeholder={`Icon URL`}
          name={'footer icon_url'}
          onChange={e => handleChange(messageId, e)}
        />
        <input
          type="text"
          className="input"
          defaultValue={embed.footer?.text}
          placeholder={'Footer text'}
          name={'footer text'}
          onChange={e => handleChange(messageId, e)}
        />
      </Collapsible>

      <button className="save_embed">
        <span>Save</span>
      </button>
    </form>
  );
}

export default GUI;
