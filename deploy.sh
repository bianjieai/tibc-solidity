echo "**************************install dependencies**************************"
yarn install

echo "**************************clean project*********************************"
yarn clean

echo "**************************compile project*******************************"
yarn compile

network=$1
is_multi_sign_wallet=$2

echo "**************************deploy libraries*******************************"
yarn hardhat deployLibraries --network $network

echo "**************************deploy acessManager****************************"
yarn hardhat deployAcessManager --network $network

echo "**************************deploy clientManager***************************"
yarn hardhat deployClientManager --network $network

echo "**************************deploy tendermint******************************"
yarn hardhat deployTendermint --network $network

echo "**************************deploy routing*********************************"
yarn hardhat deployRouting --network $network

echo "**************************deploy packet**********************************"
yarn hardhat deployPacket --network $network

echo "**************************deploy nftTransfer*****************************"
yarn hardhat deployNFTTransfer --network $network

echo "**************************deploy mtTransfer******************************"
yarn hardhat deployMtTransfer --network $network
