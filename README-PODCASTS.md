# RepSpheres Podcast System

This document provides instructions on how to use and manage the podcast system in the RepSpheres application.

## Current Setup

The podcast system is set up to display and play MP3 files from the `public/podcasts` directory. The system currently includes:

- A dedicated podcast page at `/podcast.html`
- An audio player with play/pause functionality
- Download capability for local podcast files
- Integration with both local files and remote podcasts (via Supabase)

## How to Add More Podcasts

### Method 1: Adding Local MP3 Files (Recommended)

1. **Copy your MP3 file** to the `public/podcasts` directory:
   ```bash
   cp "/path/to/your/podcast.mp3" public/podcasts/
   ```

2. **Edit the `src/PodcastPage.js` file** to add your new podcast to the `localEpisodes` array:
   ```javascript
   const localEpisodes = [
     {
       id: 'local-1',
       title: 'Venus AI ~ Evolution Products & Market Position',
       description: 'An in-depth discussion about Venus AI\'s evolution, product strategy, and market positioning.',
       url: process.env.PUBLIC_URL + '/podcasts/Venus Ai ~ Evolution Products & Market Position.mp3',
       isLocal: true
     },
     // Add your new podcast here
     {
       id: 'local-2', // Make sure to use a unique ID
       title: 'Your Podcast Title',
       description: 'Description of your podcast',
       url: process.env.PUBLIC_URL + '/podcasts/your-podcast-filename.mp3',
       isLocal: true
     }
   ];
   ```

3. **Save the file** and the new podcast will appear on the podcast page.

### Method 2: Using Supabase (For Remote Storage)

If you prefer to store your podcasts remotely, you can use Supabase:

1. **Upload your MP3 file** to a storage service of your choice (e.g., AWS S3, Google Cloud Storage).

2. **Add a record** to your Supabase `podcasts` table with the following fields:
   - `id`: A unique identifier
   - `title`: The title of your podcast
   - `description`: A description of your podcast
   - `url`: The URL to your MP3 file

3. The podcast will automatically appear on the podcast page when it loads.

## Customizing the Podcast Player

The podcast player is implemented in `src/components/Podcasts.js`. You can customize its appearance and functionality by editing this file.

## Troubleshooting

If your podcasts are not appearing or playing correctly:

1. **Check file paths**: Ensure the MP3 files are in the correct location (`public/podcasts/`).
2. **Verify file names**: Make sure the filenames in the code match the actual filenames.
3. **Check browser console**: Look for any errors in the browser's developer console.
4. **Test MP3 files**: Ensure your MP3 files are valid and can be played in other media players.

## Future Enhancements

Planned enhancements for the podcast system include:

- Automatic scanning of the podcasts directory
- Podcast categories and filtering
- Playback speed control
- Progress tracking
- Playlist functionality
