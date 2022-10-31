import '../pages.css';
// import { getCookie } from '../../utils/cookie';
import SidePanel from '../../components/SidePanel';

function Dashboard() {
  // const cookie = getCookie('access_token');
  // const url = `http://localhost:7373/dashboard/messages/${
  //   cookie ? `?access_token=${encodeURIComponent(cookie)}` : ''
  // }`;

  // const { data: messages, error: messagesError } = useFetch<MessagesResponse[]>(url);

  // if (messagesError) return <p>{messagesError.message}</p>
  return (
    <div>
      <SidePanel />
      <div className="container">
        <p>This is the dashboard</p>
        {/* <Messages messages={messages ? messages : []}/> */}
      </div>
    </div>
  );
}

export default Dashboard;
