import './styles.css';
import Menu from '../menu'

function App(props) {

  let configuration = props.configuration;
  let onChangeAppProps = props.onChangeAppProps;
  let appProps = props.appProps;

  let currentView = appProps.currentView


  return (

    <header className="Header">
      <table className='Header-full'>
        <tbody>
          <tr>
            <td className='Header-menu'>
              <Menu configuration={configuration} appProps={appProps} onChangeAppProps={onChangeAppProps} />
            </td>
            <td className='Header-view'>
              {currentView}
            </td>
          </tr>
        </tbody>
      </table>
    </header>

  );
}

export default App;
