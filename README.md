# @pixam/voe

A production-grade TypeScript API wrapper for the VOE video hosting service.

## Features

- 🚀 Full TypeScript support with comprehensive type definitions
- 🔒 Input validation using Zod
- 🔄 Automatic retry mechanism for failed requests
- ⚡ Rate limiting support
- 🛡️ Error handling with custom error classes
- 📝 Complete API coverage
- 🧪 Built-in TypeScript types

## Installation

```bash
# Using bun
bun add @pixam/voe

# Using npm
npm install @pixam/voe

# Using yarn
yarn add @pixam/voe

# Using pnpm
pnpm add @pixam/voe
```

## Usage

```typescript
import { VoeClient } from '@pixam/voe';

// Initialize the client
const client = new VoeClient({
  apiKey: 'YOUR_API_KEY',
});

// Example: Get account information
const accountInfo = await client.getAccountInfo();
console.log(accountInfo);

// Example: Upload a file
const fileBuffer = await readFile('video.mp4');
const uploadResult = await client.uploadFile(fileBuffer, 'video.mp4');
console.log(uploadResult);

// Example: Add remote upload
const remoteUpload = await client.addRemoteUpload('https://example.com/video.mp4');
console.log(remoteUpload);

// Example: Get file information
const fileInfo = await client.getFileInfo('file_code');
console.log(fileInfo);

// Example: Create a folder
const folderId = await client.createFolder('My Videos');
console.log(folderId);
```

## API Reference

### Account Methods

- `getAccountInfo()`: Get account information
- `getAccountStats()`: Get account statistics

### Upload Methods

- `getUploadServer()`: Get upload server URL
- `uploadFile(file: Buffer | string, filename: string)`: Upload a file
- `addRemoteUpload(url: string, folderId?: number)`: Add remote upload
- `getRemoteUploadList()`: Get remote upload list

### File Methods

- `cloneFile(fileCode: string, folderId?: number)`: Clone a file
- `getFileInfo(fileCodes: string | string[])`: Get file information
- `getFileList(params?: FileListParams)`: Get file list
- `renameFile(fileCode: string, title: string)`: Rename a file
- `moveFileToFolder(fileCode: string, folderId: number)`: Move file to folder
- `deleteFile(fileCode: string | string[])`: Delete file(s)

### Folder Methods

- `getFolderList(folderId?: number)`: Get folder list
- `createFolder(name: string, parentId?: number)`: Create a folder
- `renameFolder(folderId: number, name: string)`: Rename a folder

### History Methods

- `getDeletedFiles(params?: DMCAListParams)`: Get deleted files
- `getDMCAList(params?: DMCAListParams)`: Get DMCA list

### Settings Methods

- `getCurrentDomain()`: Get current adblock domain

### Premium Methods

- `generatePremiumKeys(params: PremiumKeyGenerationParams)`: Generate premium keys

## Error Handling

The client includes custom error classes for better error handling:

```typescript
import { VoeClient, VoeError, VoeAuthenticationError } from '@pixam/voe';

try {
  const client = new VoeClient({ apiKey: 'invalid_key' });
  await client.getAccountInfo();
} catch (error) {
  if (error instanceof VoeAuthenticationError) {
    console.error('Authentication failed:', error.message);
  } else if (error instanceof VoeError) {
    console.error('VOE API error:', error.message);
  } else {
    console.error('Unknown error:', error);
  }
}
```

## Configuration

The client accepts the following configuration options:

```typescript
interface VoeConfig {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}
```

## Rate Limiting

The client automatically handles rate limiting according to VOE's API guidelines (3-4 requests per second).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License
