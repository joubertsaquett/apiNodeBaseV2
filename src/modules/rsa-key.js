const NodeRSA = require('node-rsa');

const key = new NodeRSA({ b: 1024 });
// let secret = "This is a secret";

// crypt the secret
// var encryptedString = key.encrypt(secret, 'base64'); //public key
// console.log(encryptedString);

// var decryptedString = key.decrypt(encryptedString, 'utf8'); //private key
// console.log(decryptedString);


//// generate a key pair
// var public_key = key.exportKey('public');
// var private_key = key.exportKey('private');
// console.log(public_key, private_key);

// let key_private = new NodeRSA(private_key);
// let key_public = new NodeRSA(public_key);

// // Public key for encryption
// var encryptedString2 = key_public.encrypt(secret, 'base64');
// console.log(encryptedString2);

// var decryptedString2 = key_private.decrypt(encryptedString2, 'utf8');
// console.log(decryptedString2);

const rsaEncripty2 = function(public_key, secret)
{
    let key_public = new NodeRSA(public_key);
    var encryptedString2 = key_public.encrypt(secret, 'base64');
    return encryptedString2;
};
const rsaDescripty2 = function(private_key, secret)
{
    let key_private = new NodeRSA(private_key);
    var decryptedString2 = key_private.decrypt(secret, 'utf8');
    return decryptedString2;
};

// const s = rsaEncripty2(public_key, secret);
// console.log( s );
// console.log( rsaDescripty2(private_key, s) );



exports.rsaGenerate = function()
{
    var public_key = key.exportKey('public');
    var private_key = key.exportKey('private');
    const json = {
        public_key, 
        private_key
    }
    return json;
};


exports.rsaEncripty = function(public_key, secret)
{
    let key_public = new NodeRSA(public_key);
    var encryptedString2 = key_public.encrypt(secret, 'base64');
    return encryptedString2;
};


exports.rsaDecripty = function(private_key, secret)
{
    let key_private = new NodeRSA(private_key);
    var decryptedString2 = key_private.decrypt(secret, 'utf8');
    return decryptedString2;
};


