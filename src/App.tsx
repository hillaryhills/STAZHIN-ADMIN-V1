import AppRoutes from "./routes";
import { Providers } from "./redux/store/providers";
import { ToastContainer } from 'react-toastify'


export default function App() {
  return (
    <>
      <Providers>
        <ToastContainer
          closeButton={false}
          position="top-center"
          autoClose={false}
          hideProgressBar
          newestOnTop
          pauseOnHover
          toastStyle={{
            width: '100%',
            maxWidth: '430px',
            boxShadow: 'unset',
            backgroundColor: 'unset',
          }}
        />
        <AppRoutes />
      </Providers>
    </>
  );
}
