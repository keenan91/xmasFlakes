import '../styles/globals.css'
import {ChakraProvider} from '@chakra-ui/react'
import {MoralisProvider} from 'react-moralis'
import {Toaster} from 'react-hot-toast'
const serverUrl = 'https://gvrhkyktpyjl.usemoralis.com:2053/server'
const appId = 'Q4SFp1T2sY07hT7TEF9kVtNFcWsdDd6etdYGHCxS'
function MyApp({Component, pageProps}) {
  return (
    <ChakraProvider>
      <MoralisProvider appId={appId} serverUrl={serverUrl}>
        <Component {...pageProps} />
        <Toaster
          toastOptions={{
            // Define default options
            className: '',
            duration: 5000,
            style: {
              background: '#363636',
              color: '#fff',
              width: '500px',
            },
            // Default options for specific types
            success: {
              duration: 5000,
              theme: {
                primary: 'green',
                secondary: 'black',
              },
            },
          }}
        />
      </MoralisProvider>
    </ChakraProvider>
  )
}

export default MyApp
