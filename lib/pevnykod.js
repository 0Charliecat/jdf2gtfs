const iconv = require("iconv-lite")
const csv=require("csvtojson");
const fs = require("fs")
const PevnyKod = require('./jdfenum')

const JDFHeaders = ['id', 'pk', '01']

/**
 * get pevnykod
 * @param {String} path
 * @param {String|String[]} id
 * @returns {String|String[]}
 */
const run = async (path, id) => {
    const filePath = path+"/pevnykod.txt"
    const FileBuffer = fs.readFileSync(filePath);
    const Utf8String = iconv.decode(FileBuffer, 'windows-1250');
    
    const PK = await csv().fromString(JDFHeaders.join(",")+"\r\n"+Utf8String)

    if (Array.isArray(id)) {
        let Entities = []

        for (let i = 0; i < id.length; i++) {
            const r = id[i];
            
            let filt = PK.find(e=>e.id==r)

            if (filt) {
                Entities.push(PevnyKod[filt.pk])
            } 

            continue;
        }

        return Entities
    } else {
        let filt = PK.filter(e=>e.id===id)

        if (!filt) {
            return null
        } else {
            return PevnyKod[filt.pk]
        }
    }

    
}

module.exports = run