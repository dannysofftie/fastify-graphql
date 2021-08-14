import { IConfig } from '@configs';
import { ILibraries } from '@libs/index';
import { IPlugins } from '@plugins/index';
import { IJWTPayload } from '@plugins/Token';
import { ReadStream } from 'fs';

declare global {
  interface IGCPUpload {
    localStream: ReadStream;
    contentType: string;
    remotePath: string;
  }
  /**
   * Incoming GraphQL file stream.
   *
   * This is as provided by `Upload` scalar
   */
  interface IUploadFileStream {
    createReadStream(): ReadStream;
    mimetype: string;
    filename: string;
    encoding: string;
  }

  /**
   * Attachment properties. Every uploaded file must have all the properties
   */
  interface IUploadAttachment {
    file: string;
    mime: string;
    filename: string;
    encoding: string;
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    configs: IConfig;
    plugins: IPlugins;
    libs: ILibraries;
  }

  interface FastifyReply {
    user: IJWTPayload;
  }
}
