import { faImage, faPlusSquare, faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChangeEvent, FormEvent, MouseEvent } from 'react';
import Collapsible from '../Collapsible';
import Field from './Field';
import { ExtendedAPIEmbedField, ScheduledMessageEntry } from '../../types';
import { APIEmbed } from 'discord.js';
import { ChromePicker, ColorResult } from '@hello-pangea/color-picker';

interface IProps {
  scheduledMessage: ScheduledMessageEntry;
  handleRemoveField: (messageId: number, e: MouseEvent<HTMLLabelElement>) => void;
  handleAddField: (messageId: number) => void;
  handleSubmit: (messageId: number, e: FormEvent<HTMLFormElement>) => void;
  handleChange: (messageId: number, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleColorPicked: (messageId: number, color: ColorResult) => void;
}

function GUI({
  scheduledMessage,
  handleRemoveField,
  handleAddField,
  handleSubmit,
  handleChange,
  handleColorPicked
}: IProps) {
  const { id, message, date, channel, type } = scheduledMessage;
  const { content, embed }: { content: string; embed: APIEmbed } = JSON.parse(message);
  return (
    <form onSubmit={e => handleSubmit(id, e)} className="gui">
      <Collapsible title="Message Content">
        <textarea
          className="input"
          defaultValue={content}
          placeholder={'Message content'}
          name={'content'}
          onChange={e => handleChange(id, e)}
        />
      </Collapsible>

      <Collapsible title="Author">
        <FontAwesomeIcon icon={faImage} className="icon" />
        <input
          type="text"
          className="input"
          defaultValue={embed.author?.icon_url}
          placeholder={`Icon URL`}
          name={'author icon_url'}
          onChange={e => handleChange(id, e)}
        />
        <input
          type="text"
          className="input"
          defaultValue={embed.author?.name}
          placeholder={'Author name'}
          name={'author name'}
          maxLength={256}
          onChange={e => handleChange(id, e)}
        />
      </Collapsible>

      <Collapsible title={'Title'}>
        <input
          type="text"
          className="input"
          defaultValue={embed.title}
          placeholder={'Title'}
          name={'title'}
          maxLength={256}
          onChange={e => handleChange(id, e)}
        />
      </Collapsible>

      <Collapsible title={'URL'}>
        <FontAwesomeIcon icon={faLink} className="icon" />
        <input
          type="text"
          className="input"
          defaultValue={embed.url}
          placeholder={'URL'}
          name={'url'}
          onChange={e => handleChange(id, e)}
        />
      </Collapsible>

      <Collapsible title="Description">
        <textarea
          className="input"
          defaultValue={embed.description}
          placeholder={'Embed description'}
          name={'description'}
          maxLength={4096}
          onChange={e => handleChange(id, e)}
        />
      </Collapsible>

      <Collapsible title={'Fields'} id={id}>
        {embed.fields &&
          embed.fields.map(f => {
            return (
              <Field
                key={`${(f as ExtendedAPIEmbedField).key}`}
                field={f as ExtendedAPIEmbedField}
                messageId={id}
                handleRemoveField={handleRemoveField}
                handleChangeField={handleChange}
              />
            );
          })}
        {embed.fields && embed.fields.length < 25 ? (
          <label className="add_field" onClick={() => handleAddField(id)}>
            Add field
            <FontAwesomeIcon icon={faPlusSquare} className="margin" />
          </label>
        ) : (
          <label style={{ color: 'red', fontWeight: 'bold' }}>Max amount of fields reached.</label>
        )}
      </Collapsible>

      <Collapsible title={'Thumbnail'}>
        <FontAwesomeIcon icon={faImage} className="icon" />
        <input
          type="text"
          className="input"
          defaultValue={embed.thumbnail?.url}
          placeholder={'Thumbnail URL'}
          name={'thumbnail url'}
          onChange={e => handleChange(id, e)}
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
          onChange={e => handleChange(id, e)}
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
          onChange={e => handleChange(id, e)}
        />
        <input
          type="text"
          className="input"
          defaultValue={embed.footer?.text}
          placeholder={'Footer text'}
          name={'footer text'}
          maxLength={2048}
          onChange={e => handleChange(id, e)}
        />
      </Collapsible>

      <Collapsible title={'Color'}>
        <ChromePicker
          className="picker"
          color={embed.color?.toString(16)}
          onChange={color => handleColorPicked(id, color)}
          defaultView={'hex'}
          disableAlpha
        />
      </Collapsible>

      <Collapsible title={'Date'}>
        <input
          type="text"
          className="input"
          defaultValue={date}
          placeholder={'Date'}
          name={'date'}
          onChange={e => handleChange(id, e)}
        />
      </Collapsible>

      <button className="save_embed">
        <span>Save</span>
      </button>
    </form>
  );
}

export default GUI;
