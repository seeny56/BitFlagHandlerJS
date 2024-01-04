export function intToString(int){
    let output = "";
    for (let i = 0; i < 32; i++) {
        if (isBitInIntSet(int, i)) {
            output = "1" + output;
        }
        else {
            output = "0" + output;
        }
    }
    return output;
}
export function toggleBitInInt(i,pos){
    if(pos>31 || pos <0){
        throw new Error("Index out of bounds for Int");
    }

    let mask = (1 << pos);
    i[0] ^= mask;
}

//works
export function isBitInIntSet(i,pos){
    if(pos>31 || pos <0){
        throw new Error("Index out of bounds for Int");
    }
    return (i[0] & (1 << pos)) !== 0;
}

//done
export function setBitInInt(i,pos,set){
    if(pos>31 || pos <0){
        throw new Error("Index out of bounds for Int");
    }

    let mask = (1 << pos);
    if (set) {
        i[0] |= mask;
    }
    else {
        i[0] &= ~mask;
    }
}

//#region BIT OPERATOR FUNCTIONS

//Designed for little endinaness
//TODO: check for os endianness
//WORKS
export function byteToString(b) {
    let output = "";
    for (let i = 0; i < 8; i++) {
        if (isBitInByteSet(b, i)) {
            output = "1" + output;
        }
        else {
            output = "0" + output;
        }
    }
    return output;
}
export function setBitInByte(b,position,set){
    if(position>7 || position <0){
        throw new Error("Index out of bounds for byte");
    }


    let mask = ( 1 << position);
    if(set){
        b[0] |= mask;
    }
    else{
        b[0] &= ~mask;
    }
}

/** @param {Uint8Array[1]} b @param {Number} position all numbers are stored as 64 bit floating point so you can exceed byte length */
//works
export function isBitInByteSet(b,position){
    if(position>7 || position <0){
        throw new Error("Index out of bounds for byte");
    }

   return (b[0] & (1 << position)) !== 0;
}

/** @param {Uint8Array[1]} b must be object so function can set index to new value @param {Number} position all numbers are stored as 64 bit floating point so you can exceed byte length */
// WORKS
export function toggleBitInByte(b, position) {
    
    if(position>7 || position <0){
        throw new Error("Index out of bounds for byte");
    }

    let mask = 1 << position;
    b[0] = b[0] ^ mask;
    //return b[0] ^ mask[0];
}
//#endregion