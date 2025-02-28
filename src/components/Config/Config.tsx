import './Config.css';
import { ConfigEntry, GuildChannelEntry } from '../../types';
import Select from '../Select';
import ConfigDescriptions from '../../configDescriptions';
import { getStorage } from '../../utils/storage';
import { useEffect, useState } from 'react';

function Config({ data, guildChannels }: { data: ConfigEntry; guildChannels: GuildChannelEntry[] }) {
  const [values, setValues] = useState<ConfigEntry>(data);
  const [originalValues, setOriginalValues] = useState<ConfigEntry>(data);
  const [changedFields, setChangedFields] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    setValues(data);
    setOriginalValues(data);
    setChangedFields({});
  }, [data]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));

    // Check if the current value is different from original value
    const isChanged = value !== originalValues[name as keyof ConfigEntry];
    setChangedFields(prev => ({ ...prev, [name]: isChanged }));
  }

  async function handleSave(key: string) {
    const token = getStorage('access_token');
    const dataToSave = { [key]: values[key as keyof ConfigEntry] };

    await fetch(
      `${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/api/uncle/dashboard/savedata?accessToken=${token}&category=configs`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSave)
      }
    )
      .then(response => response.json())
      .then((data: { message: string }) => {
        console.log(data.message);
        setOriginalValues(prev => ({ ...prev, [key]: values[key as keyof ConfigEntry] }));
        setChangedFields(prev => ({ ...prev, [key]: false }));
      });
    // TODO: Add error handling
  }

  function getInputMethod(key: string, val: any): JSX.Element {
    if (key.includes('_channel')) {
      return (
        <Select
          guildChannels={guildChannels}
          name={key}
          selected={values[key as keyof ConfigEntry]}
          onChange={handleChange}
        />
      );
    } else if (key.includes('_message')) {
      return (
        <textarea
          className="input"
          onChange={handleChange}
          name={key}
          value={values[key as keyof ConfigEntry] || ''}
        />
      );
    } else {
      return (
        <input
          className="input"
          onChange={handleChange}
          name={key}
          type="text"
          value={values[key as keyof ConfigEntry] || ''}
        />
      );
    }
  }

  return (
    <div className="config_form">
      {Object.entries(values).map(([key, val], index) => {
        return (
          <div key={index} className="item_box">
            <p>{ConfigDescriptions[key].name}</p>
            {getInputMethod(key, val)}
            <p className="information">{ConfigDescriptions[key].description}</p>
            {changedFields[key] && (
              <button className="save_btn" onClick={() => handleSave(key)}>
                <span>Save</span>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Config;
