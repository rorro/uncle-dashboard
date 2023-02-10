import './Config.css';
import { ConfigEntry, GuildChannelEntry } from '../../types';
import Select from '../Select';
import { useForm } from '../../hooks/useForm';
import ConfigDescriptions from '../../configDescriptions';
import { getStorage } from '../../utils/storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkSlash } from '@fortawesome/free-solid-svg-icons';

function Config({ data, guildChannels }: { data: ConfigEntry; guildChannels: GuildChannelEntry[] }) {
  async function handleSave() {
    const token = getStorage('access_token');

    await fetch(
      `${process.env.REACT_APP_API_URL}:${process.env.REACT_APP_API_PORT}/api/uncle/dashboard/savedata?accessToken=${token}&category=configs`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      }
    )
      .then(response => response.json())
      .then((data: { message: string }) => console.log(data.message));
    // TODO: do something better with the response than just logging it
  }

  function getInputMethod(key: string, val: any): JSX.Element {
    if (key.includes('_channel')) {
      return (
        <Select
          guildChannels={guildChannels}
          name={key}
          selected={values[key as keyof ConfigEntry]}
          onChange={onChange}
        />
      );
    } else if (key.includes('_message')) {
      return <textarea className="input" onChange={onChange} name={key} defaultValue={val} />;
    } else {
      return <input className="input" onChange={onChange} name={key} type="text" defaultValue={val} />;
    }
  }

  const { onChange, onSubmit, values, valuesChanged } = useForm<ConfigEntry>(handleSave, data);

  return (
    <form onSubmit={onSubmit} className="config_form">
      <div className="center">
        <button
          className="save_btn"
          style={valuesChanged ? { pointerEvents: 'all', backgroundColor: '#04AA6D' } : {}}
        >
          <span>Save </span>
        </button>
      </div>
      {Object.entries(values).map(([key, val], index) => {
        return (
          <div key={index} className="item_box">
            <p>{ConfigDescriptions[key].name}</p>
            {getInputMethod(key, val)}
            <p className="information">{ConfigDescriptions[key].description}</p>
            {(key.includes('_icon') || key.includes('_image')) && val && (
              <>
                <img
                  src={val}
                  alt=""
                  onClick={e => window.open(e.currentTarget.src)}
                  onLoad={e => {
                    if (e.currentTarget.nextElementSibling) {
                      e.currentTarget.nextElementSibling.className = 'error hidden';
                    }
                  }}
                  onError={e => {
                    if (e.currentTarget.nextElementSibling) {
                      e.currentTarget.nextElementSibling.className = 'error';
                    }
                  }}
                />
                <div className="error hidden">
                  <FontAwesomeIcon icon={faLinkSlash} id="imageIcon" />
                  <label htmlFor="imageIcon"> Broken Image Link</label>
                </div>
              </>
            )}
          </div>
        );
      })}
    </form>
  );
}

export default Config;
