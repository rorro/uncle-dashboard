import { faImage, faPlusSquare, faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChangeEvent, FormEvent, MouseEvent } from 'react';
import Collapsible from '../Collapsible';
import Field from './Field';
import {
  DeleteModalOptions,
  ExtendedAPIEmbedField,
  GuildChannelEntry,
  ScheduledMessageEntry
} from '../../types';
import { APIEmbed } from 'discord.js';
import { ChromePicker, ColorResult } from '@hello-pangea/color-picker';
import dayjs from 'dayjs';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Select from '../Select';

interface IProps {
  scheduledMessage: ScheduledMessageEntry;
  guildChannels: GuildChannelEntry[];
  messageChanged: boolean;
  handleRemoveField: (messageId: number, e: MouseEvent<HTMLLabelElement>) => void;
  handleAddField: (messageId: number) => void;
  handleRemoveMessage: (modalData: DeleteModalOptions, e: MouseEvent<HTMLButtonElement>) => void;
  handleSubmit: (messageId: number, e: FormEvent<HTMLFormElement>) => void;
  handleChange: (
    messageId: number,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleColorPicked: (messageId: number, color: ColorResult) => void;
  handleDatePicked: (messageId: number, time: string | undefined) => void;
}

const darkMode = createTheme({
  palette: {
    mode: 'dark'
  }
});

function GUI({
  scheduledMessage,
  guildChannels,
  messageChanged,
  handleRemoveField,
  handleAddField,
  handleRemoveMessage,
  handleSubmit,
  handleChange,
  handleColorPicked,
  handleDatePicked
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
        {(embed.fields && embed.fields.length < 25) || !embed.fields ? (
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ThemeProvider theme={darkMode}>
            <DateTimePicker
              renderInput={props => <TextField {...props} />}
              onChange={d => handleDatePicked(id, d?.format('YYYY-MM-DD HH:mm'))}
              value={dayjs(date)}
              inputFormat={'YYYY-MM-DD HH:mm'}
              ampm={false}
            />
          </ThemeProvider>
        </LocalizationProvider>
      </Collapsible>

      <Collapsible title={'Channel'}>
        <Select
          guildChannels={guildChannels}
          name={'channel'}
          selected={channel}
          onChange={e => handleChange(id, e)}
        />
      </Collapsible>

      <button
        className="save_embed"
        style={messageChanged ? {} : { pointerEvents: 'none', backgroundColor: '#444444' }}
      >
        <span>Save</span>
      </button>

      <button
        className="delete_embed"
        onClick={e =>
          handleRemoveMessage(
            { messageId: id, date, channel: guildChannels.filter(c => c.id === channel)[0].name, embed },
            e
          )
        }
      >
        <span>Delete</span>
      </button>
    </form>
  );
}

export default GUI;
