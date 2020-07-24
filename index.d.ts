import * as forge from 'node-forge';

// High-level API

export interface PronoteSession
{
    id: number,
    server: string,
    target: PronoteTarget,

    request: number,

    aesKey: forge.util.ByteBuffer,
    aesIV: forge.util.ByteBuffer,
    aesTempIV: forge.util.ByteBuffer,
    publicKey: forge.pki.Key,

    disableAES: boolean,
    disableCompress: boolean,

    signData: any
}

export interface PronoteTarget
{
    name: string,
    id: number
}

export function login(url: string, username: string, password: string, cas?: string): Promise<PronoteSession>;

export namespace errors {
    const UNKNOWN_CAS: PronoteError;
}

export interface PronoteError
{
    code: number,
    message: string
}


// Low-level API (if you need to use this, you can, but it may mean I've forgotten a use case, please open an issue!)

export function createSession(options: CreateSessionOptions): PronoteSession;

export function cipher(session: PronoteSession, data: any, options?: CipherOptions): string;
export function decipher(session: PronoteSession, data: any, options?: DecipherOptions): string | forge.util.ByteBuffer;

export function getStart(url: string, username: string, password: string, cas: string): Promise<PronoteStartParams>;
export function auth(session: PronoteSession): Promise<void>;

export function request(session: PronoteSession, name: string, content: any): Promise<any>;

export interface CreateSessionOptions
{
    serverURL: string,
    sessionID: number,
    type: number,

    disableAES: boolean,
    disableCompress: boolean,

    keyModulus: string,
    keyExponent: string
}

export interface CipherOptions
{
    key?: forge.pki.Key,
    compress?: boolean
}

export interface DecipherOptions extends CipherOptions
{
    scrambled?: boolean,
    asBytes?: boolean
}

export interface PronoteStartParams
{
    h: string, // Session ID (number)
    a: number, // Session type (3 = student, ...)

    sCrA: boolean, // Disable AES
    sCoA: boolean, // Disable compression

    MR: string, // Public key modulus (as BigInt string)
    ER: string, // Public key exponent (as BigInt string)

    // There are more, but undocumented (feel free to open a P.R.!)
}
