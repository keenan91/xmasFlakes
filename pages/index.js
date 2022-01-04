import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import {useState, useEffect} from 'react'
import Web3Modal from 'web3modal'
import {ethers} from 'ethers'
import Web3 from 'web3'
import NFT from '../NFTWorking.sol/NFTWorking.json'
import toast from 'react-hot-toast'
import {useMoralis, useERC20Balances, useNFTBalances} from 'react-moralis'
import {
  Box,
  Text,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Spacer,
  SimpleGrid,
  Container,
  useColorMode,
  Icon,
  Spinner,
  Divider,
  BeatLoader,
} from '@chakra-ui/react'
import {ColorModeScript} from '@chakra-ui/react'
import theme from '.././theme'
import {FaMoon} from 'react-icons/fa'
import {BsSun} from 'react-icons/bs'

const Moralis = require('moralis')
let web3Modal
let connection
let provider
let signer
let contract

let contractAddress = '0x7087e1FB4a87847c1CBd40C775791ec1eF2BCaB2'.toLowerCase()
export default function Home() {
  const [state, setState] = useState('idle')
  const [nftBalance, setNftBalance] = useState(0)
  const [tokenIdOwned, setTokenIdOwned] = useState()
  const [mintDisabled, setMintDisabled] = useState()
  const [WalletResponsiveGridCols, setWalletResponsiveGridCols] = useState({
    grid: [1, 1, 2, 2, 3],
    width: ['70%'],
  })
  const {
    data: NFTBalances,
    getNFTBalances,
    error,
    isLoading,
    isFetching,
  } = useNFTBalances()
  const {authenticate, isAuthenticated, logout, account, chainId, user} =
    useMoralis()
  const {colorMode, toggleColorMode} = useColorMode()

  const connect = async () => {
    try {
      authenticate({signingMessage: 'Connecting Wallet'})
    } catch (error) {
      console.log(error)
    }
  }

  const logoutUser = async () => {
    try {
      logout()
    } catch (error) {}
  }
  const updateGridValues = (tokenIdBalance) => {
    if (tokenIdBalance == 1) {
      setWalletResponsiveGridCols({
        grid: [1, 1, 1, 1, 1],
        width: ['70%', '70%', '60%', '50%', '40%'],
      })
    } else if (tokenIdBalance == 2) {
      setWalletResponsiveGridCols({grid: [1, 1, 2, 2, 2], width: ['70%']})
    } else if (tokenIdBalance == 3) {
      setWalletResponsiveGridCols({grid: [1, 1, 2, 2, 3], width: ['70%']})
    }
  }

  const getMintCountAndTokenOwners = async () => {
    web3Modal = new Web3Modal()
    connection = await web3Modal.connect()
    provider = new ethers.providers.Web3Provider(connection)
    signer = provider.getSigner()
    contract = new ethers.Contract(contractAddress, NFT.abi, signer)
    const web3 = new Web3(window.ethereum)
    await window.ethereum.enable()
    const NameContract = new web3.eth.Contract(NFT.abi, contractAddress)
    let mintCount = await NameContract.methods.mintCount().call()
    let tokenIdArray = []
    for (let i = 1; i <= mintCount; i++) {
      let tokenIdOwner = await NameContract.methods.ownerOf(i).call()
      if (tokenIdOwner.toLowerCase() == provider.provider.selectedAddress) {
        tokenIdArray.push(i)
      }
    }
    if (tokenIdArray.length == 11) {
      setMintDisabled(true)
    }
    setTokenIdOwned(tokenIdArray)
    setNftBalance(mintCount)
    updateGridValues(tokenIdArray.length)
  }

  const mint = async () => {
    web3Modal = new Web3Modal()
    connection = await web3Modal.connect()
    provider = new ethers.providers.Web3Provider(connection)
    signer = provider.getSigner()
    contract = new ethers.Contract(contractAddress, NFT.abi, signer)

    let transaction = await contract.createToken()
    toast.success('Minting this may take 30 seconds')
    setState('loading')
    let tx = await transaction.wait()
    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()
    setState(
      'https://gateway.pinata.cloud/ipfs/QmXL6pVeNPGodVsKY8eQhLfK3vWpDrRRSTxJGqJTkaJ31q/' +
        tokenId +
        '.html',
    )
    getMintCountAndTokenOwners()
    //console.log(tokenId)
    //console.log(tx)
  }

  useEffect(() => {
    getMintCountAndTokenOwners()
  }, [setTokenIdOwned, setNftBalance])

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />

        <style></style>
      </Head>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Flex alignItems="center" boxShadow="md" p="6" rounded="md" maxH="70px">
        <Box p="2">
          <Heading color="lightblue">Christmas Flakes</Heading>
        </Box>
        <Spacer />
        {colorMode === 'light' ? (
          <Icon as={FaMoon} mr="15px" color="gray" onClick={toggleColorMode} />
        ) : (
          <Icon
            as={BsSun}
            h="20px"
            w="20px"
            color="yellow"
            mr="15px"
            onClick={toggleColorMode}
          />
        )}
        <Box>
          {!isAuthenticated ? (
            <Button variant="ghost" colorScheme="blue" onClick={connect}>
              Connect
            </Button>
          ) : (
            <Flex alignItems="center">
              <Text mr="10px">{account}</Text>
              <Button variant="ghost" colorScheme="blue" onClick={logoutUser}>
                Logout
              </Button>
            </Flex>
          )}
        </Box>
      </Flex>
      <Box
        boxShadow="md"
        rounded="md"
        height={['250px', '300px', '400px', '400px', '500px']}
        maxW="1442px"
        m="auto"
      >
        <iframe
          height="100%"
          width="100%"
          src="https://gateway.pinata.cloud/ipfs/QmZQ71zGRL24HfDYnjFxaZmywzUm4QFye8Wo7gpX2ekp3S"
        ></iframe>
      </Box>{' '}
      <Heading color="lightblue" align="center" mb="5px" mt="5px">
        The Christmas spirit lasts all year long
      </Heading>
      <Text align="center" color="lightblue" mb="5px">
        {' '}
        Enjoy 3 free Snowflakes per wallet.
      </Text>
      <Box zIndex="4" position="relative" width="70%" m="auto">
        <SimpleGrid columns={[3, 3, 3, 3, 3]} spacing={10}>
          <Box
            height="100%"
            width="100%"
            className={styles.videoWrapper}
            boxShadow="md"
            rounded="md"
            _hover={{
              boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
              transition: '0.3s',
            }}
          >
            <iframe src="https://gateway.pinata.cloud/ipfs/QmXL6pVeNPGodVsKY8eQhLfK3vWpDrRRSTxJGqJTkaJ31q/1.html"></iframe>
          </Box>
          <Flex direction="column" alignItems="center" justify="center">
            <Button
              fontSize="45px"
              size="lg"
              color="lightblue"
              variant="ghost"
              onClick={mint}
              align="center"
              isDisabled={mintDisabled}
              isLoading={state === 'loading'}
            >
              Mint
            </Button>

            <Text align="center" color="lightblue" fontSize="2xl">
              {nftBalance}/1111
            </Text>
          </Flex>

          <Box
            height="100%"
            width="100%"
            className={styles.videoWrapper}
            boxShadow="md"
            rounded="md"
            _hover={{
              boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
              transition: '0.3s',
            }}
          >
            <iframe
              height="100%"
              width="100%"
              src={
                'https://gateway.pinata.cloud/ipfs/QmXL6pVeNPGodVsKY8eQhLfK3vWpDrRRSTxJGqJTkaJ31q/111.html'
              }
            ></iframe>
          </Box>
        </SimpleGrid>
        {state != 'loading' && state != 'idle' ? (
          <>
            <Text
              mt="10px"
              mb="20px"
              fontSize={['lg', 'lg', '2xl']}
              align="center"
              color="lightblue"
            >
              Your freshly cystalized Christmas Flake
            </Text>
            <Box mt="30px" w={['80%', '80%', '80%', '70%', '50%']} m="auto">
              <Box
                boxShadow="md"
                rounded="md"
                _hover={{
                  boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
                  transition: '0.3s',
                }}
              >
                <Box className={styles.videoWrapper}>
                  <iframe src={state}></iframe>
                </Box>
                <Flex justify="space-around" alignItems="center">
                  <Text color="lightblue" fontWeight="bold" fontSize="xl">
                    Christmas Flake #{nftBalance}
                  </Text>
                  <Link href={`/flakes/${nftBalance}`}>
                    <a>
                      <Button
                        variant="ghost"
                        color="lightblue"
                        fontSize="xl"
                        fontWeight="bold"
                      >
                        View
                      </Button>
                    </a>
                  </Link>
                </Flex>
              </Box>
            </Box>
          </>
        ) : null}
      </Box>
      <main>
        {isAuthenticated ? (
          <>
            <Divider mt="20px" mb="20px" />
            {tokenIdOwned ? (
              <Heading color="lightblue" mb="20px" align="center">
                My Christmas Flakes
              </Heading>
            ) : null}

            <Box w={WalletResponsiveGridCols.width} m="auto" mb="50px">
              <SimpleGrid columns={WalletResponsiveGridCols.grid} spacing={10}>
                {tokenIdOwned &&
                  tokenIdOwned.map((nft, index) => {
                    return (
                      <Box
                        key={index}
                        boxShadow="md"
                        rounded="md"
                        _hover={{
                          boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
                          transition: '0.3s',
                        }}
                      >
                        <Box className={styles.videoWrapper}>
                          <iframe
                            src={
                              'https://gateway.pinata.cloud/ipfs/QmXL6pVeNPGodVsKY8eQhLfK3vWpDrRRSTxJGqJTkaJ31q/' +
                              nft +
                              '.html'
                            }
                          ></iframe>
                        </Box>
                        <Flex justify="space-around" alignItems="center">
                          <Text
                            color="lightblue"
                            fontWeight="bold"
                            fontSize="xl"
                          >
                            Christmas Flake #{nft}
                          </Text>
                          <Link href={`/flakes/${nft}`}>
                            <a>
                              <Button
                                variant="ghost"
                                color="lightblue"
                                fontSize="xl"
                                fontWeight="bold"
                              >
                                View
                              </Button>
                            </a>
                          </Link>
                        </Flex>
                      </Box>
                    )
                  })}
              </SimpleGrid>
            </Box>
          </>
        ) : null}

        <Heading align="center" color="lightblue">
          RoadMap
        </Heading>
        <SimpleGrid
          columns={[1, 1, 2]}
          spacing="40px"
          height="100%"
          width="70%"
          margin="auto"
          mt="20px"
        >
          <Flex
            direction="column"
            justify="center"
            alignItems="center"
            boxShadow="md"
            rounded="md"
            bg="rgba(234,176,90,.1)"
            border="1px"
            borderColor="#eab05a"
          >
            <Text
              fontSize={['md', 'lg', 'lg', 'xl', 'xl']}
              fontWeight="bold"
              p="5px"
              color="#eab05a"
            >
              Quarter 1 2022
            </Text>
            <Text
              fontSize={['md', 'md', 'md', 'md', 'lg']}
              fontWeight="bold"
              mb="5px"
              p="10px"
              color="lightblue"
            >
              AirDrop to holders of 3 or more snowflakes
            </Text>
          </Flex>

          <Flex
            direction="column"
            justify="center"
            alignItems="center"
            boxShadow="md"
            rounded="md"
            bg="rgba(234,176,90,.1)"
            border="1px"
            borderColor="#eab05a"
          >
            <Text
              fontSize={['md', 'lg', 'lg', 'xl', 'xl']}
              fontWeight="bold"
              color="#eab05a"
              p="5px"
            >
              Quarter 1 2022
            </Text>
            <Text
              fontSize={['md', 'md', 'md', 'md', 'lg']}
              fontWeight="bold"
              mb="5px"
              color="lightblue"
              p="10px"
            >
              10000 Randomly generated on-chain svg snowflakes
            </Text>
          </Flex>
        </SimpleGrid>
      </main>
      <Box className={styles.footer} mt="20px">
        <Text align="center">Powered By UniMatrix Art and HashLips Engine</Text>
      </Box>
    </div>
  )
}
