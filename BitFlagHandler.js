export const UINT_MAX_VALUE = 4294967295;
/** @param {Number} lastConSeq @param {[Number]} sequences */
export function getIntSeqFlag(lastConSeq, sequences){
    let seqFlag = new Int32Array(1);
    seqFlag[0] = 0;
    sequences.forEach((sequence) => {
        if (lastConSeq > sequence)//FINISHED: works
        {
            let distance = lastConSeq - sequence;
            if (distance < 33) {
                setBitInInt(seqFlag, 32 - distance, true);
            }
        }
        else// sequence is bigger than lastConSeq //FINISHED: works
        {
            let overflowcheck1 = lastConSeq + 1;
            if (overflowcheck1 <= UINT_MAX_VALUE) {
                let distanceFromZero = lastConSeq + 1;// not actually distance from 0 but actually distance to max value position itself or -1 of a uint
                let distanceFromMax = uint.MaxValue - sequence;
                 //check for uint overflow
                let overflowcheck2 = distanceFromZero + distanceFromMax;
                if (overflowcheck2 <= UINT_MAX_VALUE)
                {
                    let distance = distanceFromZero + distanceFromMax;
                    if (distance < 33) {
                        setBitInInt(seqFlag, 32 - distance, true);
                    }
                }
            }
        }
    });
    return seqFlag;
}

//this could cause performance issues
/** @param {Number} leftOperand @param {Number} rightOperandOperand */
export function uintSubtraction(leftOperand,rightOperand){
    return (leftOperand -rightOperand)>>>0;
}
/** @param {Number} leftOperand @param {Number} rightOperand */
export function isSeqGreater(leftOperand,rightOperand){
    // case incoming sequence is greater than previous sequence and their distance is less than half the max value
    // which means they are relatively close
    // uses ~~ bitwise operation to get proper rounding i.e ~~(13/4)=3 vs Math.Floor(13/4) = 4;
    
    if (leftOperand > rightOperand && uintSubtraction(leftOperand,rightOperand) <= ~~(UINT_MAX_VALUE / 2)) {
        return true;
    }
    else if (leftOperand < rightOperand && uintSubtraction(rightOperand,leftOperand) > ~~(UINT_MAX_VALUE / 2)) {
        // case incoming sequence is smaller than previous sequence and their distance is less than half th
        return true;
    }
    return false;
}
//works
/** @param {Number} lastConSeq @param {Uint32Array[1] | Int32Array[1]} seqFlag*/
export function readIntSeqFlag(lastConSeq,seqFlag){
    let sequences = [];
    //start for loop at highest bit flag position
    for (let bitPosition = 31; bitPosition > -1; bitPosition--)
    {
        let seqNum = 0;
        //calculate distance from last con sequence relative to bit position ie bitPosition:31 d=1 ... bitPosition:0 d=32
        let distance = 32 - bitPosition;

        //if lastConfirmedSequence is higher or equal than subtraction will never be negative
        if (lastConSeq >= distance)
        {
            seqNum = lastConSeq - distance;
        }
        else// subtraction will be negative if distance is higher than last sequence so reverse the distance operation and subtract the distance from uintMax
        {  //lastCoinSeq:31 distance:32 negativeDistance = 1; seqNum = UINT_MAX_VALUE - negativeDistance;
            let negativeDistance = distance - lastConSeq;
            seqNum = UINT_MAX_VALUE - negativeDistance + 1;// if negative distance is 1 then it needs to add 1 to include max value position
        }

        let bitStatus = false;
        if (isBitInIntSet(seqFlag, bitPosition))
        {
            bitStatus = true;
        }
        sequences.push({seqNum:seqNum,bitStatus:bitStatus});
    }

    return sequences;
}
/** @param {Uint32Array[1] | Int32Array[1] } int  */
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
/** @param {Uint32Array[1] | Int32Array[1] } i  @param {Number} pos */
export function toggleBitInInt(i,pos){
    if(pos>31 || pos <0){
        throw new Error("Index out of bounds for Int");
    }

    let mask = (1 << pos);
    i[0] ^= mask;
}

//works
/** @param {Uint32Array[1] | Int32Array[1] } i  @param {Number} pos */
export function isBitInIntSet(i,pos){
    if(pos>31 || pos <0){
        throw new Error("Index out of bounds for Int");
    }
    return (i[0] & (1 << pos)) !== 0;
}

//done
/** @param {Uint32Array[1] | Int32Array[1] } i  @param {Number} pos @param {Bool} set*/
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
/** @param {Uint8Array[1] | Int8Array[1] } b */
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
/** @param {Uint8Array[1] | Int8Array[1] } b @param {Number} position @param {Bool} set*/
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

/** @param {Uint8Array[1] | Int8Array[1] } b @param {Number} position all numbers are stored as 64 bit floating point so you can exceed byte length */
//works
export function isBitInByteSet(b,position){
    if(position>7 || position <0){
        throw new Error("Index out of bounds for byte");
    }

   return (b[0] & (1 << position)) !== 0;
}

/** @param {Uint8Array[1] | Int8Array[1] } b must be object so function can set index to new value @param {Number} position all numbers are stored as 64 bit floating point so you can exceed byte length */
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