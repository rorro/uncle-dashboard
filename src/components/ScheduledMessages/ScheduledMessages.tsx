import { useState, MouseEvent, FormEvent, ChangeEvent } from 'react';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { APIEmbed } from 'discord.js';
import './ScheduledMessages.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { ColorResult } from '@hello-pangea/color-picker';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { ToastContainer, toast } from 'react-toastify';
import {
  DeleteModalOptions,
  ExtendedAPIEmbedField,
  GuildChannelEntry,
  ScheduledMessageEntry,
  ScheduledMessageType,
  UpdateMessageOptions
} from '../../types';
import Collapsible from '../Collapsible';
import GUI from './GUI';
import { v4 as uuidv4 } from 'uuid';
import { getCookie } from '../../utils/cookie';
import ConfirmDeleteModal from '../ConfirmDeleteModal';
import Clock from '../Clock';
import EmbedPreview from '../EmbedPreview';
import { isEmptyEmbed } from '../../helpers/embed';

dayjs.extend(utc);

function ScheduledMessages({
  scheduledMessages,
  guildChannels
}: {
  scheduledMessages: ScheduledMessageEntry[];
  guildChannels: GuildChannelEntry[];
}) {
  interface T {
    [id: number]: ScheduledMessageEntry;
  }

  const initialMessages: T = {};
  const initialMessagesChanged: Record<number, boolean> = {};
  scheduledMessages.forEach(m => {
    const { content, embed } = JSON.parse(m.message);
    const fields = embed.fields;
    initialMessagesChanged[m.id] = false;

    // Add a unique key to each field so that rendering them works properly
    if (fields) {
      fields.forEach((f: Record<string, string | boolean>) => {
        if (f['key']) return; // There has to be a better way of doing this

        f['key'] = uuidv4();
      });
      m.message = JSON.stringify({ content: content, embed: embed });
    }
    initialMessages[m.id] = m;
  });

  const [messages, setMessages] = useState<T>(initialMessages);
  const [previousMessages, setPreviousMessages] = useState<T>(initialMessages);
  const [messageChanged, setMessageChanged] = useState<Record<number, boolean>>(initialMessagesChanged);
  const [deleteModalOpen, setDeleteModelOpen] = useState<boolean>(false);
  const [deleteModalData, setDeleteModelData] = useState<DeleteModalOptions | undefined>();

  function toggleDeleteModal() {
    setDeleteModelOpen(!deleteModalOpen);
  }

  function addField(messageId: number) {
    const newField: ExtendedAPIEmbedField = {
      name: 'Field name',
      value: 'Field value',
      inline: false,
      key: uuidv4()
    };

    const message = messages[messageId];

    const { embed } = JSON.parse(message.message);
    embed.fields ? embed.fields.push(newField) : (embed.fields = [newField]);

    updateMessages(message, { embed: embed });
  }

  function getClickedField(
    messageId: number,
    e:
      | MouseEvent<HTMLLabelElement>
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): number | null {
    const parent = e.currentTarget.parentElement;

    const fieldsContainer = document.querySelector(`[id='${messageId}']`);
    const fields = fieldsContainer?.querySelectorAll('.field');

    if (!fields) return null;

    let clickedField: number | null = null;
    for (const [i, f] of Object.entries(fields)) {
      if (f === parent) {
        clickedField = +i;
        break;
      }
    }
    return clickedField;
  }

  function removeField(messageId: number, e: MouseEvent<HTMLLabelElement>) {
    const clickedField = getClickedField(messageId, e);
    if (clickedField === null) return;

    const message = messages[messageId];
    const { embed } = JSON.parse(message.message);

    embed.fields.splice(clickedField, 1);
    if (embed.fields.length === 0) {
      delete embed.fields;
    }

    updateMessages(message, { embed: embed });
  }

  function onColorPicked(messageId: number, color: ColorResult) {
    const col = parseInt(color.hex.substring(1), 16);

    const scheduledMessage = messages[messageId];
    let { embed }: Record<string, any> = JSON.parse(scheduledMessage.message);
    embed['color'] = col;

    updateMessages(scheduledMessage, { embed: embed });
  }

  function onDatePicked(messageId: number, date: string | undefined) {
    if (!date || date.toLowerCase().includes('invalid')) return;

    const scheduledMessage = messages[messageId];
    scheduledMessage.date = date;

    updateMessages(scheduledMessage, {});
  }

  function onChange(
    messageId: number,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const [name, key] = e.currentTarget.name.split(' ');

    const value =
      key === 'inline'
        ? (e as ChangeEvent<HTMLInputElement>).currentTarget.checked
        : e.currentTarget.value;

    const scheduledMessage = messages[messageId];
    let { embed } = JSON.parse(scheduledMessage.message);

    let options: UpdateMessageOptions = {};

    switch (name as APIEmbed) {
      case 'content':
      case 'channel':
        options[name as keyof UpdateMessageOptions] = value.toString();
        break;
      case 'title':
      case 'description':
      case 'url':
        embed[name] = value;
        if (!value) delete embed[name];
        break;
      case 'thumbnail':
      case 'image':
      case 'footer':
      case 'author':
        embed[name] = { ...embed[name], ...{ [key]: value } };
        if (!value) delete embed[name][key];
        if (Object.keys(embed[name]).length === 0) delete embed[name];
        break;
      case 'fields':
        const clickedField = getClickedField(messageId, e);
        if (clickedField === null) break;
        embed[name][clickedField] = { ...embed[name][clickedField], ...{ [key]: value } };
        break;
    }

    options.embed = embed;
    updateMessages(scheduledMessage, options);
  }

  function handleAddNewMessage() {
    const newMessage: ScheduledMessageEntry = {
      id: Math.random(),
      message: `{"content": "", "embed": {}}`,
      date: dayjs().utc().format('YYYY-MM-DD HH:mm'),
      channel: guildChannels[1].id,
      type: ScheduledMessageType.Embed
    };

    updateMessages(newMessage, {});
  }

  function removeMessage(modalData: DeleteModalOptions, e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    setDeleteModelData(modalData);
    toggleDeleteModal();
  }

  async function confirmDeleteMessage(messageId: number) {
    const cookie = getCookie('access_token');

    await fetch(
      `http://${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/dashboard/deletemessage?accessToken=${cookie}&messageId=${messageId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then(response => response.json())
      .then((data: { message: string }) => {
        //TODO: only if successfully saved scheduled message set changed to false
        setMessageChanged({
          ...messageChanged,
          [messageId]: false
        });

        setPreviousMessages(messages);
      });

    const newMessages: T = {};
    Object.entries(messages).forEach(([id, m]) => {
      if (id !== messageId.toString()) {
        newMessages[+id] = m;
      }
    });
    setMessages(newMessages);

    const newMessagesChanged: Record<number, boolean> = {};
    Object.entries(messageChanged).forEach(([id, c]) => {
      if (id !== messageId.toString()) {
        newMessagesChanged[+id] = c;
      }
    });
    setMessageChanged(newMessagesChanged);

    toggleDeleteModal();
  }

  function updateMessages(message: ScheduledMessageEntry, options: UpdateMessageOptions) {
    const { content, embed, date, channel } = options;
    const { content: originalContent, embed: originalEmbed } = JSON.parse(message.message);

    const updatedMessage = {
      id: message.id,
      message: JSON.stringify({
        content: content !== undefined ? content : originalContent,
        embed: embed ? (isEmptyEmbed(embed) ? {} : embed) : originalEmbed
      }),
      date: date ? date : message.date,
      channel: channel ? channel : message.channel,
      type: message.type
    };

    setMessages({
      ...messages,
      [message.id]: updatedMessage
    });

    const changed = JSON.stringify(updatedMessage) !== JSON.stringify(previousMessages[message.id]);

    setMessageChanged({
      ...messageChanged,
      [message.id]: changed
    });
  }

  async function onSubmitCallback(messageId: number) {
    const cookie = getCookie('access_token');

    await fetch(
      `http://${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/dashboard/savedata?accessToken=${cookie}&category=scheduled_messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messages[messageId])
      }
    )
      .then(response => response.json())
      .then((data: { newId: number; message: string }) => {
        if (!data.message.includes('Successfully')) {
          toast.error(
            `Message was not saved for some reason. It might have already been sent. Reload the page and try again.`,
            {
              position: 'top-center',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              theme: 'dark'
            }
          );
          return;
        }

        if (messageId < 1) {
          // Change the generated id with the new correct id returned from server
          const newIdMessage = messages[messageId];
          newIdMessage['id'] = data.newId;
          delete messages[messageId];

          setMessages({
            ...messages,
            [data.newId]: newIdMessage
          });
        }

        setMessageChanged({
          ...messageChanged,
          [messageId]: false
        });

        setPreviousMessages(messages);
      });
  }

  async function hasEmptyFields(messageId: number) {
    const fields: ExtendedAPIEmbedField[] = JSON.parse(messages[messageId].message).embed.fields;
    if (!fields) return false;
    for (const field of fields) {
      if (field.name.trim() === '' || field.value.trim() === '') return true;
    }
    return false;
  }

  const onSubmit = async (messageId: number, event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (await hasEmptyFields(messageId)) {
      toast.error(`Field name and value can't be empty.`, {
        position: 'top-center',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        theme: 'dark'
      });
      return;
    }
    await onSubmitCallback(messageId);
  };

  return (
    <>
      <ToastContainer style={{ fontSize: '.8em' }} />
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        toggle={toggleDeleteModal}
        confirmDelete={confirmDeleteMessage}
        modalData={deleteModalData}
      />
      <div className="wrapper">
        <div className="bar_content">
          <Clock />
          <button id="new_message" onClick={handleAddNewMessage}>
            ADD MESSAGE
            <FontAwesomeIcon style={{ marginLeft: '5px' }} icon={faPlusSquare} />
          </button>
        </div>
        {Object.keys(messages).map(oId => {
          const { id, date, channel, message } = messages[+oId];
          const { embed, content } = JSON.parse(message);

          return (
            <div className="container" key={id}>
              <Collapsible
                title={embed.title || '[empty title]'}
                id={id}
                date={date}
                channel={guildChannels.filter(c => c.id === channel)[0].name}
              >
                <GUI
                  scheduledMessage={messages[id]}
                  guildChannels={guildChannels}
                  messageChanged={messageChanged[id]}
                  handleRemoveField={removeField}
                  handleAddField={addField}
                  handleRemoveMessage={removeMessage}
                  handleSubmit={onSubmit}
                  handleChange={onChange}
                  handleColorPicked={onColorPicked}
                  handleDatePicked={onDatePicked}
                />
                <EmbedPreview embed={embed} content={content} date={date} />
              </Collapsible>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default ScheduledMessages;
