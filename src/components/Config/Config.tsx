import './Config.css';
import { ConfigEntry, GuildChannelEntry } from '../../types';
import Select from '../Select';
import { useForm } from '../../hooks/useForm';
import ConfigDescriptions from '../../configDescriptions';
import { getCookie } from '../../utils/cookie';

function Config({ data, guildChannels }: { data: ConfigEntry; guildChannels: GuildChannelEntry[] }) {
  async function handleSave() {
    console.log(values);
    const cookie = getCookie('access_token');
    console.log(`cookie: ${cookie}`);

    await fetch(`http://localhost:7373/dashboard/savedata?accessToken=${cookie}&category=configs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    })
      .then(response => response.json())
      .then((data: { message: string }) => console.log(data.message));
  }

  const { onChange, onSubmit, values, valuesChanged } = useForm<ConfigEntry>(handleSave, data);
  console.log(`valuesChanged: ${valuesChanged}`);
  console.log(`data: ${data}`);

  return (
    <form onSubmit={onSubmit} className="config_form">
      {Object.entries(data).map(([key, val], index) => {
        return (
          <div key={index} className="item_box">
            <p>{ConfigDescriptions[key].name}</p>
            {key.includes('_channel') ? (
              <Select
                guildChannels={guildChannels}
                name={key}
                selected={values[key as keyof ConfigEntry]}
                onChange={onChange}
              />
            ) : (
              <input className="input" onChange={onChange} name={key} type="text" defaultValue={val} />
            )}
            <p className="information">{ConfigDescriptions[key].description}</p>
            {(key.includes('_icon') || key.includes('_image')) && (
              <img src={val} alt="" onClick={e => window.open(e.currentTarget.src)} />
            )}
          </div>
        );
      })}

      <button
        className="save_btn"
        style={valuesChanged ? { pointerEvents: 'all', backgroundColor: '#04AA6D' } : {}}
      >
        <span>Save </span>
      </button>
    </form>
  );
}

export default Config;
