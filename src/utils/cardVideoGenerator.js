// cardVideoGenerator.js
// Jenere yon bèl videyo animasyon kout (5.5 segonn) nan fòma 9:16 ak mizik
// Pare pou estati WhatsApp, Instagram Stories, ak telechajman

export async function generateCardVideo({
  recipient = 'Zanmi m',
  sender = 'Mwen menm',
  title = 'Kat Ve & Swè',
  message = '',
  template = {},
  audioUrl = '/audio/deck_the_halls.mp3',
  onProgress = () => {}
}) {
  return new Promise(async (resolve, reject) => {
    try {
      // 1. Kreye Canvas 720 x 1280 (9:16 Portrait)
      const width = 720;
      const height = 1280;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // Tcheke sipò MediaRecorder
      if (typeof window === 'undefined' || !window.MediaRecorder) {
        throw new Error('Navigatè a pa sipòte MediaRecorder');
      }

      // Detèmine MIME type ki pi konpatib (MP4 si posib, sinon WebM)
      const mimeCandidates = [
        'video/mp4;codecs=avc1',
        'video/mp4',
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm'
      ];
      let selectedMime = mimeCandidates.find(type => {
        try {
          return MediaRecorder.isTypeSupported(type);
        } catch (e) {
          return false;
        }
      }) || 'video/webm';

      const isMp4 = selectedMime.includes('mp4');
      const fileExtension = isMp4 ? 'mp4' : 'webm';

      // 2. Prepare Odyo ak Web Audio API
      let audioCtx = null;
      let audioSource = null;
      let audioDest = null;
      let audioBuffer = null;

      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass && audioUrl) {
          audioCtx = new AudioContextClass();
          const response = await fetch(audioUrl);
          const arrayBuffer = await response.arrayBuffer();
          audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
          audioDest = audioCtx.createMediaStreamDestination();
        }
      } catch (audioErr) {
        console.warn('Odyo pa t ka chaje pou videyo a, videyo a ap fèt san son:', audioErr);
      }

      // 3. Konbine Canvas Stream ak Audio Stream
      const canvasStream = canvas.captureStream(30); // 30 FPS
      const tracks = [...canvasStream.getVideoTracks()];
      if (audioDest && audioDest.stream) {
        tracks.push(...audioDest.stream.getAudioTracks());
      }
      const combinedStream = new MediaStream(tracks);

      const recorder = new MediaRecorder(combinedStream, {
        mimeType: selectedMime,
        videoBitsPerSecond: 2500000 // 2.5 Mbps bon kalite HD
      });

      const chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        try {
          if (audioSource) {
            audioSource.stop();
            audioSource.disconnect();
          }
          if (audioCtx && audioCtx.state !== 'closed') {
            audioCtx.close();
          }
        } catch (e) {}

        const blob = new Blob(chunks, { type: selectedMime });
        resolve({
          blob,
          extension: fileExtension,
          mimeType: selectedMime
        });
      };

      // Kòmanse anrejistreman
      recorder.start();

      // Si gen odyo, kòmanse jwe l nan stream la apre 0.5 segonn (menm jan ak kase sele a)
      if (audioCtx && audioBuffer && audioDest) {
        audioSource = audioCtx.createBufferSource();
        audioSource.buffer = audioBuffer;
        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.8, audioCtx.currentTime);
        audioSource.connect(gainNode);
        gainNode.connect(audioDest);
        setTimeout(() => {
          try {
            audioSource.start(0);
          } catch (e) {}
        }, 500);
      }

      // 4. Bouk Animasyon (5.5 segonn = 165 frames nan 30 FPS)
      const totalFrames = 165;
      let frame = 0;
      const fps = 30;
      const frameDuration = 1000 / fps;

      // Koulè ak estil selon template
      const envColor = template.envelopeColor || '#1E3326';
      const accentColor = template.accentColor || '#C99726';
      const parchmentBg = template.parchmentBg || '#FFFDF9';

      // Patikil dore pou animasyon
      const particles = Array.from({ length: 35 }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.5 + 1,
        speedY: -(Math.random() * 0.8 + 0.3),
        alpha: Math.random() * 0.6 + 0.2
      }));

      const renderFrame = () => {
        const progress = frame / totalFrames;
        const currentTimeSec = frame / fps;

        // Notifye pwogrè
        onProgress(Math.min(0.98, progress));

        // --- Fond Luxury Gradye ---
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, '#0C1710');
        bgGrad.addColorStop(0.5, '#152B1E');
        bgGrad.addColorStop(1, '#08100B');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Patikil dore k ap flote
        particles.forEach(p => {
          p.y += p.speedY;
          if (p.y < 0) p.y = height;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(245, 215, 127, ${p.alpha})`;
          ctx.fill();
        });

        // --- Brand Antèt ---
        ctx.fillStyle = '#C99726';
        ctx.font = 'bold 22px "Montserrat", sans-serif';
        ctx.textAlign = 'center';
        ctx.letterSpacing = '3px';
        ctx.fillText('KAT DIJITAL • 1804 / 2027', width / 2, 80);

        ctx.fillStyle = '#E6D7B8';
        ctx.font = '500 16px "Montserrat", sans-serif';
        ctx.fillText(`Kado espesyal pou ${recipient}`, width / 2, 115);

        // --- Faz 1 : 0s a 1.2s (Anvlòp Sele) ---
        // --- Faz 2 : 1.2s a 2.2s (Sele kase + rabat louvri) ---
        // --- Faz 3 : 2.2s a 5.5s (Kat la monte epi ouvri) ---

        const cardAppearProgress = Math.max(0, Math.min(1, (currentTimeSec - 1.6) / 1.5));
        // Easing kout
        const cardY = 680 - cardAppearProgress * 320; // Kat la monte
        const cardScale = 0.82 + cardAppearProgress * 0.18;

        // Desen Kat/Pachmen an
        if (cardAppearProgress > 0) {
          ctx.save();
          ctx.translate(width / 2, cardY);
          ctx.scale(cardScale, cardScale);

          // Lonbraj kat
          ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
          ctx.shadowBlur = 25;
          ctx.shadowOffsetY = 12;

          // Kò kat la
          const cardW = 540;
          const cardH = 740;
          ctx.fillStyle = parchmentBg;
          ctx.beginPath();
          ctx.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, 12);
          ctx.fill();

          // Reset lonbraj
          ctx.shadowColor = 'transparent';

          // Bòdi an lò
          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 4;
          ctx.strokeRect(-cardW / 2 + 18, -cardH / 2 + 18, cardW - 36, cardH - 36);

          ctx.strokeStyle = '#D4AF37';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(-cardW / 2 + 25, -cardH / 2 + 25, cardW - 50, cardH - 50);

          // Tit kat
          ctx.fillStyle = envColor;
          ctx.font = 'bold 30px "Montserrat", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(title, 0, -cardH / 2 + 85);

          ctx.strokeStyle = '#D4AF37';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-60, -cardH / 2 + 105);
          ctx.lineTo(60, -cardH / 2 + 105);
          ctx.stroke();

          // Destinatè
          ctx.fillStyle = '#111110';
          ctx.font = 'bold 26px "Montserrat", sans-serif';
          ctx.fillText(`${recipient},`, 0, -cardH / 2 + 175);

          // Mesaj kout (limite pou anfòm nan videyo a)
          ctx.fillStyle = '#2B2B28';
          ctx.font = '500 18px "Montserrat", sans-serif';
          const words = message.split(' ');
          let line = '';
          let textY = -cardH / 2 + 230;
          const maxTextW = 440;
          const lineH = 34;
          let lineCount = 0;

          for (let w = 0; w < words.length && lineCount < 7; w++) {
            const test = line + words[w] + ' ';
            if (ctx.measureText(test).width > maxTextW && w > 0) {
              ctx.fillText(line, 0, textY);
              line = words[w] + ' ';
              textY += lineH;
              lineCount++;
            } else {
              line = test;
            }
          }
          if (lineCount < 7) {
            ctx.fillText(line, 0, textY);
          }

          // Siyati
          ctx.fillStyle = '#7A756B';
          ctx.font = '13px "Montserrat", sans-serif';
          ctx.letterSpacing = '2px';
          ctx.fillText('AK TOUT AFEKSYON MWEN,', 0, cardH / 2 - 95);

          ctx.fillStyle = envColor;
          ctx.font = 'bold 26px "Montserrat", sans-serif';
          ctx.fillText(sender, 0, cardH / 2 - 55);

          ctx.restore();
        }

        // --- Desen Anvlòp (anba kat la pou bay efè 3D li soti anndan an) ---
        const envW = 580;
        const envH = 380;
        const envCenterY = 920;

        ctx.save();
        ctx.translate(width / 2, envCenterY);

        // Kò anvlòp (Pòch prensipal)
        ctx.fillStyle = envColor;
        ctx.beginPath();
        ctx.roundRect(-envW / 2, -envH / 2, envW, envH, 8);
        ctx.fill();

        // Pliye triyangilè anvlòp
        ctx.fillStyle = '#17271E';
        ctx.beginPath();
        ctx.moveTo(-envW / 2, envH / 2);
        ctx.lineTo(0, 30);
        ctx.lineTo(envW / 2, envH / 2);
        ctx.closePath();
        ctx.fill();

        // Si sele a poko kase (anvan 1.2s)
        if (currentTimeSec < 1.2) {
          // Rabat ki fèmen
          ctx.fillStyle = '#223D2D';
          ctx.beginPath();
          ctx.moveTo(-envW / 2, -envH / 2);
          ctx.lineTo(0, 40);
          ctx.lineTo(envW / 2, -envH / 2);
          ctx.closePath();
          ctx.fill();

          // Bòdi dore sou rabat
          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 2;
          ctx.stroke();

          // Sele Sire De Liks (KD)
          ctx.beginPath();
          ctx.arc(0, 40, 32, 0, Math.PI * 2);
          ctx.fillStyle = '#8C243B';
          ctx.fill();
          ctx.strokeStyle = '#F5D77F';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          ctx.fillStyle = '#F5D77F';
          ctx.font = 'bold 18px "Montserrat", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('KD', 0, 40);
        } else if (currentTimeSec < 1.8) {
          // Eklatasyon etensèl lè sele a kase
          const sparkCount = 18;
          const explodeProgress = (currentTimeSec - 1.2) / 0.6;
          for (let i = 0; i < sparkCount; i++) {
            const angle = (i / sparkCount) * Math.PI * 2;
            const dist = explodeProgress * 90;
            const sx = Math.cos(angle) * dist;
            const sy = 40 + Math.sin(angle) * dist;
            ctx.beginPath();
            ctx.arc(sx, sy, 3 * (1 - explodeProgress), 0, Math.PI * 2);
            ctx.fillStyle = '#F5D77F';
            ctx.fill();
          }
        }

        ctx.restore();

        // --- Pye Paj Videyo a ---
        ctx.fillStyle = '#8A6518';
        ctx.font = '600 14px "Montserrat", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('KatDijital • Papetri Dijital de Liks', width / 2, 1220);

        frame++;
        if (frame <= totalFrames) {
          setTimeout(renderFrame, frameDuration);
        } else {
          onProgress(1.0);
          recorder.stop();
        }
      };

      // Kòmanse animasyon an
      renderFrame();

    } catch (err) {
      console.error('Erè pandan jenerasyon videyo:', err);
      reject(err);
    }
  });
}
