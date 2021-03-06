import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import {useState, useEffect, useMemo, useLayoutEffect, useCallback} from 'react'
import Web3Modal from 'web3modal'
import {ethers} from 'ethers'
import Web3 from 'web3'
import NFT from '../Christmasflakes.sol/Christmasflakes.json'
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
import Header from '../componets/Header'
import SnowFlake from '../componets/SnowFlake'
const Moralis = require('moralis')
let web3Modal
let connection
let provider
let signer
let contract

const contractAddress =
  '0x7EC7AcAF6e53e0B8a4fB8AC319fdd80958B38e03'.toLowerCase()

export default function Home() {
  const [size, setSize] = useState([1800, 969])
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
  const {
    authenticate,
    isAuthenticated,
    logout,
    account,
    chainId,
    user,
    authError,
  } = useMoralis()

  console.log(user?.attributes?.accounts[0])
  let trucatedAccount =
    user?.attributes?.accounts[0]?.substring(0, 6) +
    '...' +
    user?.attributes?.accounts[0]?.substring(
      user?.attributes?.accounts[0].length - 4,
      user?.attributes?.accounts[0].length,
    )
  const {colorMode, toggleColorMode} = useColorMode()
  useLayoutEffect(() => {}, [])

  //testfunction()
  const connect = async () => {
    if (chainId != '0x89') {
      return toast.error('Please switch to the Polygon Mainnet network')
    }
    try {
      authenticate({signingMessage: 'Connecting Wallet'})
    } catch (error) {}
    getMintCountAndTokenOwners()
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
        //size: [size[0] / 3, size[0] / 1.5, size[0] / 1.5, size[0] / 2],
      })
    } else if (tokenIdBalance == 2) {
      setWalletResponsiveGridCols({
        grid: [1, 1, 1, 2, 2],
        width: ['95%', '95%', '90%', '85%', '80%'],
        //size: [size[0] / 1.2, size[0] / 1.5, size[0] / 2.5, size[0] / 3.5],
      })
    } else if (tokenIdBalance >= 3) {
      setWalletResponsiveGridCols({
        grid: [1, 1, 1, 2, 2],
        width: ['95%', '95%', '90%', '70%', '70%'],
        // size: [size[0] / 1.2, size[0] / 1.5, size[0] / 2.5, size[0] / 3.5],
      })
    } else if (tokenIdBalance == 0) {
      setWalletResponsiveGridCols({
        grid: [1, 1, 1, 1, 1],
        width: ['70%', '70%', '90%', '90%', '90%'],
        //size: [size[0] / 2, size[0] / 1.5, size[0] / 1.5, size[0] / 2],
      })
    }
  }

  const getMintCountAndTokenOwners = async () => {
    if (isAuthenticated === true) {
      const web3 = new Web3(window.ethereum)
      const NameContract = new web3.eth.Contract(NFT.abi, contractAddress)
      let mintCount = await NameContract.methods.mintCount().call()
      let tokenIdArray = []
      for (let i = 1; i <= mintCount; i++) {
        let tokenIdOwner = await NameContract.methods.ownerOf(i).call()
        if (tokenIdOwner.toLowerCase() == user?.attributes?.accounts[0]) {
          tokenIdArray.push(i)
        }
      }
      if (tokenIdArray.length == 2) {
        setMintDisabled(true)
      }
      setTokenIdOwned(tokenIdArray)
      setNftBalance(mintCount)
      updateGridValues(tokenIdArray.length)
    }

    try {
      const web3 = new Web3(window.ethereum)
      const NameContract = new web3.eth.Contract(NFT.abi, contractAddress)
      let mintCount = await NameContract.methods.mintCount().call()
      setNftBalance(mintCount)
    } catch (error) {}
  }

  const mint = async () => {
    web3Modal = new Web3Modal()
    connection = await web3Modal.connect()
    provider = new ethers.providers.Web3Provider(connection)
    signer = provider.getSigner()
    contract = new ethers.Contract(contractAddress, NFT.abi, signer)
    var options = {gasPrice: '300000000000', gasLimit: '50000'}
    let transaction = await contract.createToken(options)
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
  }

  useEffect(() => {
    // if (
    //   window.matchMedia &&
    //   window.matchMedia('(prefers-color-scheme: dark)').matches &&
    //   colorMode !== 'dark'
    // ) {
    //   toggleColorMode()
    // }
    // if (
    //   window.matchMedia &&
    //   window.matchMedia('(prefers-color-scheme: light)').matches &&
    //   colorMode !== 'light'
    // ) {
    //   toggleColorMode()
    // }

    getMintCountAndTokenOwners()
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight])
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
  }, [isAuthenticated])

  return (
    <>
      <Head>
        <title>Christmas Flakes</title>
        <meta
          name="description"
          content="Generative art collection of Snowflakes"
        />
        <link rel="icon" href="/favicon.ico" />
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
            <Button colorScheme="blue" onClick={connect}>
              Connect
            </Button>
          ) : (
            <Flex alignItems="center">
              <Text mr="10px">{trucatedAccount}</Text>
              <Button colorScheme="blue" onClick={logoutUser}>
                Logout
              </Button>
            </Flex>
          )}
        </Box>
      </Flex>

      <Box h={size[0] / 3.5}>
        <Header png={97}></Header>
      </Box>

      <Heading
        color="lightblue"
        align="center"
        mb="5px"
        mt="10px"
        fontSize={['20px', '25px', '30px', '35px']}
      >
        The Christmas spirit lasts all year long
      </Heading>
      <Link
        href={`https://polygonscan.com/address/0x7EC7AcAF6e53e0B8a4fB8AC319fdd80958B38e03#code`}
      >
        <a>
          <Text
            align="center"
            color="lightblue"
            mb={['5px', '7px', '10px']}
            fontSize={['sm', 'md', 'lg']}
          >
            0x7EC7AcAF6e53e0B8a4fB8AC319fdd80958B38e03
          </Text>
        </a>
      </Link>

      <Text
        align="center"
        color="lightblue"
        mb={['5px', '7px', '10px']}
        fontSize={['sm', 'md', 'lg']}
      >
        {' '}
        Enjoy 2 free Snowflakes per wallet.
      </Text>
      <Box zIndex="4" width={['90%', '90%', '80%']} m="auto">
        <Flex alignItems="center" justify="center">
          <Box h={size[0] / 5} w={size[0] / 5}>
            {/*   <MemoizedSnowflake png="1111" size={size} /> */}
            <SnowFlake png="1111" size={size} />
          </Box>
          <Flex
            direction="column"
            alignItems="center"
            justify="center"
            h={[size[0] / 3, size[0] / 5, size[0] / 5]}
            w={[size[0] / 3, size[0] / 5, size[0] / 5]}
          >
            {isAuthenticated ? (
              <Button
                fontSize={['3xl', '3xl', '4xl', '5xl', '5xl']}
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
            ) : (
              <Button
                fontSize={['3xl', '3xl', '4xl', '5xl', '5xl']}
                size="lg"
                color="lightblue"
                variant="ghost"
                onClick={connect}
                align="center"
              >
                Mint
              </Button>
            )}
            <Text align="center" color="lightblue" fontSize="2xl">
              {nftBalance}/1111
            </Text>
          </Flex>

          <Box h={size[0] / 5} w={size[0] / 5}>
            {/* <MemoizedSnowflake png="111" size={size} /> */}
            <SnowFlake png="111" size={size} />
          </Box>
        </Flex>
      </Box>
      <main>
        {isAuthenticated ? (
          <>
            {tokenIdOwned ? (
              <Heading
                color="lightblue"
                mb="20px"
                align="center"
                mt={['10px', '10px', '10px', '15px', '20px']}
                fontSize={['20px', '25px', '30px', '35px']}
              >
                My Christmas Flakes
              </Heading>
            ) : null}

            <Box w={WalletResponsiveGridCols.width} m="auto" mb="50px">
              <SimpleGrid
                columns={WalletResponsiveGridCols.grid}
                spacing={['20px', '20px', '20px', '20px']}
              >
                {tokenIdOwned &&
                  tokenIdOwned?.map((nft, index) => {
                    return (
                      <Flex
                        key={index}
                        justify="center"
                        direction="column"
                        alignItems="center"
                      >
                        <Box
                          boxShadow="md"
                          rounded="md"
                          _hover={{
                            boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)',
                            transition: '0.3s',
                          }}
                        >
                          <Box
                            h={[
                              size[0] / 1.2,
                              size[0] / 1.5,
                              size[0] / 2,
                              size[0] / 3,
                            ]}
                            w={[
                              size[0] / 1.2,
                              size[0] / 1.5,
                              size[0] / 2,
                              size[0] / 3,
                            ]}
                          >
                            <SnowFlake
                              className={styles.card}
                              png={nft}
                              size={size}
                            ></SnowFlake>
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
                      </Flex>
                    )
                  })}
              </SimpleGrid>
            </Box>
          </>
        ) : null}

        <Heading align="center" color="lightblue" mt="15px">
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
    </>
  )
}
