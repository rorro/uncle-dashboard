import { ColorResult } from '@hello-pangea/color-picker';
import { ChangeEvent, FormEvent, MouseEvent, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import 'react-toastify/dist/ReactToastify.min.css';
import Collapsible from '../../components/Collapsible';
import GUI from '../../components/EmbedGUI/GUI';
import EmbedPreview from '../../components/EmbedPreview';
import { EmbedConfigs, ExtendedAPIEmbedField, ToastType } from '../../types';
import './Embeds.css';
import { UpdateMessageOptions } from '../../types';
import { getClickedField, isEmptyEmbed } from '../../helpers/embed';
import { getStorage } from '../../utils/storage';
import sendToast from '../../utils/toast';

function Embeds({ embeds }: { embeds: EmbedConfigs }) {
  interface T {
    [id: number]: { id: number; name: string; title: string; data: string };
  }

  const initialEmbeds: T = {
    1: { id: 1, name: 'application_embed', title: 'Application Embed', data: embeds.application_embed },
    2: { id: 2, name: 'support_embed', title: 'Support Embed', data: embeds.support_embed }
  };

  const initialEmbedsChanged: Record<number, boolean> = { 0: false, 1: false };

  const [currentEmbeds, setCurrentEmbeds] = useState<T>(initialEmbeds);
  const [previousEmbeds, setPreviousEmbeds] = useState<T>(initialEmbeds);
  const [embedChanged, setEmbedChanged] = useState<Record<number, boolean>>(initialEmbedsChanged);

  const messageChanged = { support: false, application: false };
  function addField(messageId: number) {
    const newField: ExtendedAPIEmbedField = {
      name: 'Field name',
      value: 'Field value',
      inline: false,
      key: uuidv4()
    };

    const message = currentEmbeds[messageId];

    const { embed } = JSON.parse(message.data);
    embed.fields ? embed.fields.push(newField) : (embed.fields = [newField]);

    updateMessages(message, { embed: embed });
  }

  function removeField(mid: number, e: MouseEvent<HTMLLabelElement>) {
    const clickedField = getClickedField(mid, e);
    if (clickedField === null) return;

    const message = currentEmbeds[mid];
    const { embed } = JSON.parse(message.data);

    embed.fields?.splice(clickedField, 1);
    if (embed.fields?.length === 0) {
      delete embed.fields;
    }

    updateMessages(message, { embed: embed });
  }

  async function hasEmptyFields(messageId: number) {
    const fields: ExtendedAPIEmbedField[] = JSON.parse(currentEmbeds[messageId].data).embed.fields;
    if (!fields) return false;
    for (const field of fields) {
      if (field.name.trim() === '' || field.value.trim() === '') return true;
    }
    return false;
  }

  async function handleSubmit(messageId: number, e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (await hasEmptyFields(messageId)) {
      sendToast(`Field name and value can't be empty.`, ToastType.Error);
      return;
    }

    await onSubmitCallback(messageId);
  }

  async function onSubmitCallback(messageId: number) {
    const token = getStorage('access_token');

    await fetch(
      `${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/api/uncle/dashboard/savedata?accessToken=${token}&category=embeds`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentEmbeds[messageId])
      }
    )
      .then(response => response.json())
      .then((data: { message: string }) => {
        if (data.message.toLowerCase().includes('success')) {
          sendToast(data.message, ToastType.Success);
        } else {
          sendToast(data.message, ToastType.Error);
          return;
        }

        setEmbedChanged({
          ...messageChanged,
          [messageId]: false
        });

        setPreviousEmbeds({
          ...previousEmbeds,
          [messageId]: currentEmbeds[messageId]
        });
      });
  }

  function handleChange(
    messageId: number,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const [name, key] = e.currentTarget.name.split(' ');

    const value =
      key === 'inline'
        ? (e as ChangeEvent<HTMLInputElement>).currentTarget.checked
        : e.currentTarget.value;

    const message = currentEmbeds[messageId];
    let { embed } = JSON.parse(message.data);
    let options: UpdateMessageOptions = {};

    switch (name) {
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
    updateMessages(message, options);
  }

  function handleColorPicked(messageId: number, color: ColorResult) {
    const col = parseInt(color.hex.substring(1), 16);

    const message = currentEmbeds[messageId];
    let { embed }: Record<string, any> = JSON.parse(message.data);
    embed['color'] = col;

    updateMessages(message, { embed: embed });
  }

  function updateMessages(
    message: { id: number; name: string; title: string; data: string },
    newData: UpdateMessageOptions
  ) {
    const { data } = message;
    const { content: originalContent, embed: originalEmbed } = JSON.parse(data);

    const { content: newContent, embed: newEmbed } = newData;

    const updatedMessage = {
      id: message.id,
      name: message.name,
      title: message.title,
      data: JSON.stringify({
        content: newContent !== undefined ? newContent : originalContent,
        embed: newEmbed ? (isEmptyEmbed(newEmbed) ? {} : newEmbed) : originalEmbed
      })
    };

    setCurrentEmbeds({
      ...currentEmbeds,
      [message.id]: updatedMessage
    });

    const changed = JSON.stringify(updatedMessage) !== JSON.stringify(previousEmbeds[message.id]);

    setEmbedChanged({
      ...messageChanged,
      [message.id]: changed
    });
  }

  return (
    <div className="wrapper">
      {Object.keys(currentEmbeds).map(oId => {
        const { id, title, data } = currentEmbeds[+oId];
        const { content, embed } = JSON.parse(data);

        return (
          <div className="container" key={id}>
            <Collapsible title={title} id={id}>
              <GUI
                id={id}
                content={content}
                embed={embed}
                messageChanged={embedChanged[id]}
                handleRemoveField={removeField}
                handleAddField={addField}
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                handleColorPicked={handleColorPicked}
              ></GUI>
              <div className="float-right">
                <EmbedPreview content={content} embed={embed} />
              </div>
            </Collapsible>
          </div>
        );
      })}
    </div>
  );
}

export default Embeds;
