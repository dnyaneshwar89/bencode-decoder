# Bencode-decoder

## Description

Bencode-decoder is a command line tool developed in Node.js that allows you to decode a bencoded string. This tool was developed with the thought of being able to decode torrent files but can be used to decode any other file types with are encoded using bencoding. It offers a set of commands to perform this tasks conveniently via the command line interface.

## Getting Started

To start using bencode-decoder, follow these steps

```sh
git clone https://github.com/dnyaneshwar89/bencode-decoder.git

cd bencode-decoder

npm i
```

### Examples

- display help information:

```sh
 $ node index.js help
Usage: node index.js <options> <string | file_path>

Arguments:
string,file_path    			bencoded string or file_path to a bencoded string(torrent file)

Options:
-s                  			bencoded string to decode
-f                  			file path to file storing bencoded string to decode
-help, --help, help 			display help
```

- decode a bencoded string

```sh
$ node index.js -s "d10:dictionaryd6:sample24:This a sample dictionarye7:integer2:074:listli1ei2ei3e1:4e6:string23:This is a sample stringe"
OUTPUT:
{
    "dictionary": {
        "sample": "This a sample dictionary"
    },
    "integer": "07",
    "list": [
        1,
        2,
        3,
        "4"
    ],
    "string": "This is a sample string"
}
```

- decode a bencoded torrent file

```sh
$ node index.js -f ./sample.torrent
OUTPUT:
{
    "announce": "udp://tracker.openbittorrent.com:80",
    "creation date": 1327049827,
    "info": {
        "length": 20,
        "name": "sample.txt",
        "piece length": 65536,
        "pieces": "\\ÅæR¾\ræòx\u0005³\u0004dÿ\u0000ôðÉ",
        "private": 1
    }
}
```
