import * as forge from 'node-forge';

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

export function createSession(options: CreateSessionOptions): PronoteSession;

export function cipher(session: PronoteSession, data: any, options?: CipherOptions): string;
export function decipher(session: PronoteSession, data: any, options?: DecipherOptions): string | forge.util.ByteBuffer;

export function request(session: PronoteSession, name: string, content: any): any;

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
