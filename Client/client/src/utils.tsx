export function toObject(keys:any, values:any)
{
    const data:any = {};

    keys.forEach((element:any, index:any) => {
        data[element] = values[index];
    });

    return data;
}

export function getBase64(file:File, cb:any) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        cb(reader.result)
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}