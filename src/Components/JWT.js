export default function JWT(token) {

    if(!token || token.length < 1) {
        return {
            content: '',
            valid: false
        }
    }

    var parts = token.split(".")
    if(parts.length != 3) {
        return {
            content: '',
            valid: false
        }
    }

    token = JSON.parse(atob(decodeToken(parts[1])))
    var now = Math.round((new Date()).getTime() / 1000)
    if(token.nbf < now && now >= token.exp) {
        return {
            content: '',
            valid: false
        }
    }

    return {
        start: token.nbf,
        end: token.exp,
        content: token,
        valid: true
    }
}

function decodeToken(input) {
    // Replace non-url compatible chars with base64 standard chars
    input = input
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    // Pad out with standard base64 required padding characters
    var pad = input.length % 4;
    if(pad) {
        if(pad === 1) {
            throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
        }
        input += new Array(5-pad).join('=');
    }

    return input;
}