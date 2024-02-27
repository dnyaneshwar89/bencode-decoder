const fs = require('fs');

// If set to true, then debug logs will be printed
const DEBUG = false;

/**
 * decodes the first component present in the bencoded input
 * @param {string} input - valid bencoded sting
 * */
const decodeFirstComponent = (input) => {
  if (DEBUG) console.log(`decodeFirstComponent for ${input}`);

  const startChar = input[0];

  switch (startChar) {
    case 'i': {
      const indexOfCharE = input.indexOf('e');
      if (indexOfCharE === -1) {
        if (DEBUG) console.log(`Input ${input} is not a valid bencoded string`);
        return null;
      }
      if (DEBUG) console.log(`indexOfCharE is ${indexOfCharE}`);
      const decodedInput = input.slice(1, indexOfCharE);
      if (DEBUG)
        console.log(
          `Decoded string is ${decodedInput} for bencoded string ${input}`
        );
      return {
        decodedInput: parseInt(decodedInput),
        remainingString: input.slice(indexOfCharE + 1),
      };
    }
    case 'l': {
      const list = [];
      //if (input[-1] === "e") {
      //console.log('last is not e')
      //console.log(`Input ${input} is not a valid bencoded string`);
      //return null
      //}
      //let inputForWhile = input.slice(1, -1)
      let inputForWhile = input.slice(1);
      while (true) {
        if (DEBUG) console.log(`Decoding list input for ${inputForWhile}`);
        const output = decodeFirstComponent(inputForWhile);
        if (DEBUG)
          console.log(
            `Finished Decoding list input for ${inputForWhile}, output: `,
            output
          );
        if (output === null) return null;
        if (!output.decodedInput) {
          if (DEBUG)
            console.log(
              `decodeFirstComponent returned decodedInput as ${output.decodedInput}`
            );
          return null;
        }
        if (inputForWhile[0] !== 'e') list.push(output.decodedInput);
        if (output.remainingString[0] === 'e') {
          if (DEBUG) console.log(`Fininshed execution for ${input}`);
          return {
            decodedInput: list,
            remainingString: output.remainingString.slice(1),
          };
        }
        inputForWhile = output.remainingString;
        if (DEBUG) console.log({ output });
        //break
      }
    }
    case 'd': {
      const dict = {};
      //if (input[-1] === "e") {
      //console.log('last is not e')
      //console.log(`Input ${input} is not a valid bencoded string`);
      //return null
      //}
      //let inputForWhile = input.slice(1, -1)
      let inputForWhile = input.slice(1);
      while (true) {
        // first decode for key
        let outputForKey = decodeFirstComponent(inputForWhile);
        if (outputForKey === null) return null;
        if (outputForKey.decodedInput === 'e') {
          if (DEBUG) console.log(`finished decoding for dict`);
          if (DEBUG) console.log(`Fininshed execution for ${input}`);
          return {
            decodedInput: dict,
            remainingString: outputForKey.remainingString,
          };
        }
        if (!outputForKey.decodedInput) {
          if (DEBUG)
            console.log(
              `decodeFirstComponent returned decodedInput as ${outputForKey.decodedInput}`
            );
          return null;
        }
        if (!outputForKey.remainingString) {
          if (DEBUG) console.log(`Fininshed execution for ${input}`);
          if (DEBUG)
            console.log(`No value found for key ${outputForKey.decodedInput}`);
          return null;
        }
        if (DEBUG)
          console.log(
            `decoded key ${outputForKey.decodedInput} for input ${inputForWhile}`
          );
        const outputForValue = decodeFirstComponent(
          outputForKey.remainingString
        );
        if (outputForValue === null) return null;
        if (!outputForValue.decodedInput) {
          if (DEBUG)
            console.log(
              `decodeFirstComponent returned decodedInput as ${outputForValue.decodedInput}`
            );
          return null;
        }
        if (DEBUG)
          console.log(
            `decoded value ${outputForValue.decodedInput} for key ${outputForKey.decodedInput} for input ${inputForWhile}`
          );
        dict[outputForKey.decodedInput] = outputForValue.decodedInput;
        if (outputForValue.remainingString[0] === 'e') {
          if (DEBUG) console.log(`Fininshed execution for ${input}`);
          return {
            decodedInput: dict,
            remainingString: outputForValue.remainingString.slice(1),
          };
        }
        inputForWhile = outputForValue.remainingString;
        if (DEBUG) console.log({ outputForKey, outputForValue });
        //break
      }
    }
    case 'e': {
      if (DEBUG) console.log('End found for a list or dict');
      return { decodedInput: 'e', remainingString: input.slice(1) };
    }
    default: {
      // check if it is starts with number
      if (DEBUG) console.log({ startChar });
      const charForSemiColon = input.indexOf(':');
      if (charForSemiColon === -1) {
        if (DEBUG) console.log('no semi colon found for string');
        if (DEBUG) console.log(`Input ${input} is not a valid bencoded string`);
        return null;
      }
      const lengthForString = input.slice(0, charForSemiColon);
      if (parseInt(lengthForString) === NaN) {
        if (DEBUG) console.log('not a number');
        if (DEBUG) console.log(`Input ${input} is not a valid bencoded string`);
        return null;
      }
      if (DEBUG)
        console.log(
          `String length ${lengthForString}, length: ${lengthForString.length}`
        );
      // now check if there are enough chars
      if (input.length < parseInt(lengthForString) + 2) {
        if (DEBUG) console.log(`Input ${input} is not a valid bencoded string`);
        return null;
      }

      decodedInput = input.slice(
        lengthForString.length + 1,
        parseInt(lengthForString) + lengthForString.length + 1
      );
      if (DEBUG)
        console.log(
          `Decoded string is ${decodedInput} for bencoded string ${input}`
        );
      return {
        decodedInput,
        remainingString: input.slice(
          decodedInput.length + lengthForString.length + 1
        ),
      };
    }
  }
};
//console.log(JSON.stringify(decodeFirstComponent('l4:spami909ei42eli23el3:hiieee')))
//console.log(JSON.stringify(decodeFirstComponent('li23e3:hiie')))
//console.log(JSON.stringify(decodeFirstComponent('li1ee')))
//console.log(JSON.stringify(decodeFirstComponent('i2398348e')))
//console.log(JSON.stringify(decodeFirstComponent('4:spam')))
//console.log(JSON.stringify(decodeFirstComponent('12:spamspamspam')))
//console.log(JSON.stringify(decodeFirstComponent('d4:spami07e4:listl4:spami909ei42eli23el3:hiieeee')))
//console.log(JSON.stringify(decodeFirstComponent('d8:announce40:udp://tracker.leechers-paradise.org:696913:announce-listll40:udp://tracker.leechers-paradise.org:6969el34:udp://tracker.coppersurfer.tk:6969eee')))
//console.log(JSON.stringify(decodeFirstComponent('d8:announce40:udp://tracker.leechers-paradise.org:696913:announce-listll40:udp://tracker.leechers-paradise.org:6969el40:udp://tracker.leechers-paradise.org:6969eee')))
//console.log(JSON.stringify(decodeFirstComponent('d8:announce40:udp://tracker.leechers-paradise.org:696913:announce-listlli1eeli2eeee')))
//console.log(JSON.stringify(decodeFirstComponent('d4:spam5:hello4:listli23el3:hiieee')))
//console.log(JSON.stringify(decodeFirstComponent('d7:addressd7:country2:US5:state2:CAe3:agei18e7:hobbiesl7:reading7:cyclinge4:name4:Johne')))
//console.log(JSON.stringify(decodeFirstComponent('d5:filesld6:lengthi4850e4:pathl21:Tears of Steel.de.srteed6:lengthi4755e4:pathl21:Tears of Steel.en.srteed6:lengthi4944e4:pathl21:Tears of Steel.es.srteed6:lengthi4618e4:pathl21:Tears of Steel.fr.srteed6:lengthi4746e4:pathl21:Tears of Steel.it.srteed6:lengthi4531e4:pathl21:Tears of Steel.nl.srteed6:lengthi9558e4:pathl21:Tears of Steel.no.srteed6:lengthi5933e4:pathl21:Tears of Steel.ru.srteed6:lengthi571346576e4:pathl19:Tears of Steel.webmeed6:lengthi35996e4:pathl10:poster.jpgeeee')))
//console.log(JSON.stringify(decodeFirstComponent('d5:filesld6:lengthi1234e4:pathl10:tears_fileeeee')))

//const data = fs.readFileSync('./mytorrent.torrent', { encoding: "binary", flag: "r" })
//const data = fs.readFileSync('./tears-of-steel.torrent', { encoding: "binary", flag: "r" })
//const data = fs.readFileSync('./sample.torrent', {
//encoding: 'binary',
//flag: 'r',
//});
//console.log(JSON.stringify({ finalData: decodeFirstComponent(data.slice(0, 300)) }, null, 4))
//console.log(JSON.stringify({ finalData: decodeFirstComponent(data) }, null, 4));

const decode = (input) => {
  try {
    const output = decodeFirstComponent(input);
    if (output === null || output?.remainingString !== '') {
      console.log(`Invalid bencoded string received: ${input}`);
      return;
    }
    let outputToPrint = output.decodedInput;
    if (typeof outputToPrint === 'object')
      outputToPrint = JSON.stringify(outputToPrint, null, 4);
    //console.log(`Decoded output for input: ${input}\n OUTPUT: `);
    console.log(`OUTPUT: `);
    console.log(outputToPrint);
    return;
  } catch (err) {
    console.log(`Error ocurred while decoding string: ${err.message}`);
    return;
  }
};

let args = process.argv.slice(2);

const INPUT_TYPES = {
  STRING: 'string',
  FILE: 'file',
};

let inputType = null;
let input = null;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (DEBUG) console.log(arg);
  if (arg.startsWith('-s=') || arg.startsWith('-f=')) {
    input = arg.slice(3);
    inputType = arg.slice(0, 3);
    if (inputType == '-s=') inputType = INPUT_TYPES.STRING;
    else if (inputType === '-f=') inputType = INPUT_TYPES.FILE;
    else inputType = null;

    if (DEBUG) console.log(`Processing input for "=": ${input}`);
  }
  if (arg === '-s' || arg === '-f') {
    input = args[i + 1];
    if (arg === '-s') inputType = INPUT_TYPES.STRING;
    else if (arg === '-f') inputType = INPUT_TYPES.FILE;
    if (DEBUG) console.log(`Processing input for space: ${input}`);
  }
  if (input) break;
}

if (input) {
  if (inputType === INPUT_TYPES.FILE) {
    const data = fs.readFileSync(input, {
      encoding: 'binary',
      flag: 'r',
    });
    decode(data);
  } else if (inputType === INPUT_TYPES.STRING) {
    decode(input);
  } else {
    console.log(
      `You need to pass input using flags '-s' for string input or '-f' for file input`
    );
  }
} else
  console.log(
    `You need to pass input using flags '-s' for string input or '-f' for file input`
  );

//console.log(args);

//decode('4:spam');
//decode('i82e');
//decode('li82ee');
//decode('d4:spamli82eee');
//const data = fs.readFileSync('./sample.torrent', {
//encoding: 'binary',
//flag: 'r',
//});
//decode(data);
