import Head from 'next/head'
import Link from 'next/link'
import styles from '../../styles/Home.module.css'
import {useState, useEffect, useLayoutEffect} from 'react'
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
} from '@chakra-ui/react'
import {ColorModeScript} from '@chakra-ui/react'
import theme from '../.././theme'
import {FaMoon} from 'react-icons/fa'
import {BsSun} from 'react-icons/bs'
import {useMoralis, useERC20Balances, useNFTBalances} from 'react-moralis'
import SnowFlake from '../../componets/SnowFlake'
const rarity = [
  {trait: 'AfricanViolet', weight: '1', occurrence: '4.50'},
  {trait: 'AtomicTangerine', weight: '1', occurrence: '4.59'},
  {trait: 'Baby', weight: '1', occurrence: '3.87'},
  {trait: 'BabyClothes', weight: '1', occurrence: '5.04'},
  {trait: 'BabySky', weight: '1', occurrence: '4.86'},
  {trait: 'BlueJeans', weight: '1', occurrence: '3.60'},
  {trait: 'BoraBora', weight: '1', occurrence: '4.77'},
  {trait: 'BurntOrange', weight: '1', occurrence: '4.68'},
  {trait: 'CanaryCandyApple', weight: '1', occurrence: '3.78'},
  {trait: 'CandyBlue', weight: '1', occurrence: '3.87'},
  {trait: 'CandyFloss', weight: '1', occurrence: '5.58'},
  {trait: 'CaribbeanCarrot', weight: '1', occurrence: '4.41'},
  {trait: 'ColdCyan', weight: '1', occurrence: '4.68'},
  {trait: 'CoolMidnite', weight: '1', occurrence: '3.51'},
  {trait: 'DeepSeaBabyBlue', weight: '1', occurrence: '4.32'},
  {trait: 'DeeperSeaBabyBlue', weight: '1', occurrence: '4.95'},
  {trait: 'EarthToSun', weight: '1', occurrence: '4.05'},
  {trait: 'FrenchSky', weight: '1', occurrence: '4.77'},
  {trait: 'IceyBlue', weight: '1', occurrence: '5.40'},
  {trait: 'MoonOnTheDarkSide', weight: '1', occurrence: '5.76'},
  {trait: 'SunRise', weight: '1', occurrence: '5.58'},
  {trait: 'SunToMoon', weight: '1', occurrence: '3.42'},
  {trait: 'Large', weight: '1', occurrence: '36.09'},
  {trait: 'Medium', weight: '1', occurrence: '32.22'},
  {trait: 'Small', weight: '1', occurrence: '31.68'},
  {trait: 'Crystallization', weight: '1', occurrence: '35.73'},
  {trait: 'Metastable', weight: '1', occurrence: '31.86'},
  {trait: 'Supercooled', weight: '1', occurrence: '32.40'},
  {trait: 'CooledCrystals', weight: '1', occurrence: '34.02'},
  {trait: 'Frazil', weight: '1', occurrence: '33.39'},
  {trait: 'Hail', weight: '1', occurrence: '32.58'},
  {trait: 'AirBubbles', weight: '1', occurrence: '19.62'},
  {trait: 'BubbleFlakes', weight: '1', occurrence: '18.72'},
  {trait: 'GlowingCrystals', weight: '1', occurrence: '20.97'},
  {trait: 'MicroOrbs', weight: '1', occurrence: '21.15'},
  {trait: 'OrbFlakes', weight: '1', occurrence: '19.53'},
  {trait: 'Alfa', weight: '1', occurrence: '25.65'},
  {trait: 'Beta', weight: '1', occurrence: '25.29'},
  {trait: 'Delta', weight: '1', occurrence: '23.58'},
  {trait: 'Gamma', weight: '1', occurrence: '25.47'},
  {trait: 'Core', weight: '1', occurrence: '100.00'},
  {trait: 'Convergent', weight: '1', occurrence: '23.85'},
  {trait: 'Electromagnetic', weight: '1', occurrence: '26.55'},
  {trait: 'Reflection', weight: '1', occurrence: '23.85'},
  {trait: 'Refraction', weight: '1', occurrence: '25.74'},
  {trait: 'ArticZeo', weight: '1', occurrence: '2.97'},
  {trait: 'AtlanticZeo', weight: '1', occurrence: '2.52'},
  {trait: 'BabyZeo', weight: '1', occurrence: '3.87'},
  {trait: 'BlazingZeo', weight: '1', occurrence: '3.24'},
  {trait: 'CandyZeo', weight: '1', occurrence: '3.87'},
  {trait: 'ColdestZeo', weight: '1', occurrence: '3.78'},
  {trait: 'DeepMoroccanZeo', weight: '1', occurrence: '3.42'},
  {trait: 'EasterZeo', weight: '1', occurrence: '3.51'},
  {trait: 'EmergingZeo', weight: '1', occurrence: '2.88'},
  {trait: 'FadedBlazeZeo', weight: '1', occurrence: '4.23'},
  {trait: 'FadedEasterZeo', weight: '1', occurrence: '2.97'},
  {trait: 'FadedFrozenBlueZeo2', weight: '1', occurrence: '3.15'},
  {trait: 'FadedPlumZeo', weight: '1', occurrence: '2.79'},
  {trait: 'FadedmoroccanZeo', weight: '1', occurrence: '3.15'},
  {trait: 'ForestscapeZeo', weight: '1', occurrence: '3.51'},
  {trait: 'FormingZeo', weight: '1', occurrence: '2.61'},
  {trait: 'FractalZeo', weight: '1', occurrence: '3.24'},
  {trait: 'FrozenBlueZeo', weight: '1', occurrence: '3.15'},
  {trait: 'InPinkZeo', weight: '1', occurrence: '3.24'},
  {trait: 'MorningGrassZeo', weight: '1', occurrence: '3.06'},
  {trait: 'MorningShineZeo', weight: '1', occurrence: '3.60'},
  {trait: 'NuclearZeo', weight: '1', occurrence: '3.78'},
  {trait: 'PastelZeo', weight: '1', occurrence: '3.60'},
  {trait: 'PlumCrazyZeo', weight: '1', occurrence: '3.96'},
  {trait: 'PowderBlueZeo', weight: '1', occurrence: '2.70'},
  {trait: 'SeaZeo', weight: '1', occurrence: '3.42'},
  {trait: 'SouthPoleZeo', weight: '1', occurrence: '3.60'},
  {trait: 'SpringZeo', weight: '1', occurrence: '3.69'},
  {trait: 'SummerZeo', weight: '1', occurrence: '3.60'},
  {trait: 'TooPinkZeo', weight: '1', occurrence: '2.88'},
  {trait: 'Crystalline', weight: '1', occurrence: '24.57'},
  {trait: 'Liquid', weight: '1', occurrence: '26.01'},
  {trait: 'SheetIce', weight: '1', occurrence: '25.20'},
  {trait: 'Snow', weight: '1', occurrence: '24.21'},
  {trait: 'Freshwater', weight: '1', occurrence: '34.20'},
  {trait: 'Liquid', weight: '1', occurrence: '33.30'},
  {trait: 'Seawater', weight: '1', occurrence: '32.49'},
  {trait: 'LargeCrystalization', weight: '1', occurrence: '50.86'},
  {trait: 'SmallCrystalization', weight: '1', occurrence: '49.14'},
  {trait: 'HeavyGlow', weight: '1', occurrence: '49.32'},
  {trait: 'LightGlow', weight: '1', occurrence: '50.68'},
  {trait: 'HeavyPollen', weight: '1', occurrence: '49.77'},
  {trait: 'LightPollen', weight: '1', occurrence: '50.23'},
  {trait: 'HeavyDust', weight: '1', occurrence: '49.23'},
  {trait: 'LightDust', weight: '1', occurrence: '50.77'},
]
const colorPallet = {
  mostlikely: {
    borderColor: '#5aeb97',
    bgColor: 'rgba(90,234,152,.1)',
  },
  likely: {
    borderColor: '#5bdf5a',
    bgColor: 'rgba(93,234,90,.1)',
  },
  rare: {
    borderColor: '#bceb5a',
    bgColor: 'rgba(188,234,90,.1)',
  },
  veryrare: {
    borderColor: '#ffe600',
    bgColor: 'rgba(255,230,0,.1)',
  },
  superrare: {
    borderColor: '#eab05a',
    bgColor: 'rgba(234,176,90,.1)',
  },
}
let activeBorderColor = colorPallet.veryrare.borderColor
let activeBgColor = colorPallet.veryrare.bgColor

const connect = async () => {
  try {
    authenticate({signingMessage: 'Hello World!'})
  } catch (error) {}
}
const logoutUser = async () => {
  try {
    logout()
  } catch (error) {}
}
export default function TokenId({nft}) {
  const [size, setSize] = useState([0, 0])
  const {colorMode, toggleColorMode} = useColorMode()
  const {authenticate, isAuthenticated, logout, account, chainId, user} =
    useMoralis()
  let trucatedAccount =
    account?.substring(0, 6) +
    '...' +
    account?.substring(account.length - 4, account.length)
  const [state, setState] = useState()
  const imageURL =
    'https://gateway.pinata.cloud/ipfs/QmXL6pVeNPGodVsKY8eQhLfK3vWpDrRRSTxJGqJTkaJ31q/' +
    nft.tokenId +
    '.html'
  const JSONURL =
    'https://gateway.pinata.cloud/ipfs/QmaZCb4wEZJQ3CtPYzdUWeJ6xKiwx4emBPtXww9HXbMcLB/' +
    nft.tokenId +
    '.json'

  async function fetchMetaDatas() {
    const response = await fetch(JSONURL)
    const metaData = await response.json()
    const filterUndefined = (anyValue) => typeof anyValue !== 'undefined'
    const metaDataRarity = metaData.attributes.map((metadata) => {
      let metadataColor = rarity
        .map((rarityData) => {
          // used to filter duplicate rarity because both Crystalization and Macrocrystalization have liquid as a value
          if (
            metadata.trait_type == 'Crystalization' &&
            metadata.value == 'Liquid' &&
            rarityData.occurrence == '26.01'
          ) {
            return undefined
          }

          if (
            metadata.trait_type == 'Macrocrystalization' &&
            metadata.value == 'Liquid' &&
            rarityData.occurrence == '33.30'
          ) {
            return undefined
          }
          if (metadata.value == rarityData.trait) {
            let bgColorRarity
            let borderColorRarity
            if (rarityData.occurrence >= 80) {
              bgColorRarity = colorPallet.mostlikely.bgColor
              borderColorRarity = colorPallet.mostlikely.borderColor
            } else if (
              rarityData.occurrence >= 60 &&
              rarityData.occurrence <= 80
            ) {
              bgColorRarity = colorPallet.likely.bgColor
              borderColorRarity = colorPallet.likely.borderColor
            } else if (
              rarityData.occurrence >= 40 &&
              rarityData.occurrence <= 60
            ) {
              bgColorRarity = colorPallet.rare.bgColor
              borderColorRarity = colorPallet.rare.borderColor
            } else if (
              rarityData.occurrence >= 20 &&
              rarityData.occurrence <= 40
            ) {
              bgColorRarity = colorPallet.veryrare.bgColor
              borderColorRarity = colorPallet.veryrare.borderColor
            } else if (rarityData.occurrence <= 20) {
              bgColorRarity = colorPallet.superrare.bgColor
              borderColorRarity = colorPallet.superrare.borderColor
            }

            return {
              trait_type: metadata.trait_type,
              value: metadata.value,
              occurrence: Math.round(rarityData.occurrence),
              bgColorRarity: bgColorRarity,
              borderColorRarity: borderColorRarity,
            }
          }
        })
        .filter(filterUndefined)
      return metadataColor
    })
    let finalMetadata = [].concat(...metaDataRarity)
    setState(finalMetadata)

    console.log(finalMetadata)
  }

  useLayoutEffect(() => {}, [])

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
    fetchMetaDatas()
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
        <title> Christmas Flakes</title>
        <meta
          name="Which Christmas flake will cause the avlanche"
          content="flakes"
        />
      </Head>

      <ColorModeScript initialColorMode={theme.config.initialColorMode} />

      <Flex alignItems="center" boxShadow="md" p="6" rounded="md" maxH="70px">
        <Box p="2">
          <Link href="/">
            <a>
              <Heading
                color="lightblue"
                fontSize={['md', 'lg', '3xl', '4xl', '4xl']}
              >
                Christmas Flakes
              </Heading>
            </a>
          </Link>
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
              <Text mr="10px">{trucatedAccount}</Text>
              <Button variant="ghost" colorScheme="blue" onClick={logoutUser}>
                Logout
              </Button>
            </Flex>
          )}
        </Box>
      </Flex>
      <body>
        <Heading
          align="center"
          color="lightblue"
          mb="5px"
          mt="10px"
          fontSize={['20px', '25px', '30px', '35px']}
        >
          {' '}
          Christmas Flake #{nft.tokenId}
        </Heading>
        <SimpleGrid
          columns={[1, 1, 1, 2, 2]}
          spacing={['50px', '10px', '15px', '0px']}
          m="auto"
          pr="10px"
          pl="10px"
          mb="10px"
          mt={['5px', '10px', '10px', '15px', '20px']}
          maxW="1500px"
        >
          <Flex direction="column" alignItems="center">
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
                  size[0] / 1.4,
                  size[0] / 1.9,
                  size[0] / 2.5,
                  size[0] / 2.5,
                  size[0] / 3,
                ]}
                w={[
                  size[0] / 1.2,
                  size[0] / 1.4,
                  size[0] / 1.9,
                  size[0] / 2.5,
                  size[0] / 2.5,
                  size[0] / 3,
                ]}
              >
                <SnowFlake
                  className={styles.card}
                  png={nft.tokenId}
                ></SnowFlake>
              </Box>
              <Flex justify="center" alignItems="center">
                <Text
                  color="lightblue"
                  fontWeight="bold"
                  fontSize={['md', 'lg', 'lg', 'xl']}
                >
                  Christmas Flake #{nft.tokenId}
                </Text>
                <Link href={`/`} replace={true}>
                  <a>
                    <Button
                      variant="ghost"
                      color="lightblue"
                      fontSize={['md', 'lg', 'lg', 'xl']}
                      fontWeight="bold"
                    >
                      Home
                    </Button>
                  </a>
                </Link>
              </Flex>
            </Box>
          </Flex>

          <SimpleGrid
            boxShadow="md"
            columns={[1, 2, 3]}
            spacing="10px"
            rounded="md"
            height="100%"
          >
            {state?.map((item, index) => {
              return (
                <Flex
                  direction="column"
                  justify="center"
                  alignItems="center"
                  boxShadow="md"
                  rounded="md"
                  bg={item.bgColorRarity}
                  border="1px"
                  borderColor={item.borderColorRarity}
                  key={index}
                >
                  <Text fontSize={['xs', 'xs', 'sm']}>Property</Text>
                  <Text
                    fontSize={['sm', 'sm', 'md', 'md', 'lg']}
                    fontWeight="bold"
                    mb="5px"
                    color="lightblue"
                  >
                    {item.trait_type}
                  </Text>
                  <Text fontSize={['xs', 'xs', 'sm']}>Value</Text>
                  <Text
                    fontSize={['sm', 'sm', 'sm', 'sm', 'lg']}
                    fontWeight="bold"
                    mb="5px"
                    color="lightblue"
                  >
                    {item.value}
                  </Text>
                  <Text
                    fontSize={['sm', 'sm', 'md', 'md', 'lg']}
                    fontWeight="bold"
                    mb="10px"
                    color={item.borderColorRarity}
                  >
                    {item.occurrence}% Probability
                  </Text>
                </Flex>
              )
            })}
          </SimpleGrid>
        </SimpleGrid>
        <footer className={styles.footer}>
          <Text align="center">
            Powered By UniMatrix Art and HashLips Engine
          </Text>
        </footer>
      </body>
    </>
  )
}

export async function getStaticProps({params}) {
  const nft = params

  return {
    props: {
      nft,
    },
  }
}

export async function getStaticPaths() {
  let paths = []

  for (let i = 1; i < 1000; i++) {
    paths.push({
      params: {
        tokenId: i.toString(),
      },
    })
  }
  return {
    paths,
    fallback: false,
  }
}
