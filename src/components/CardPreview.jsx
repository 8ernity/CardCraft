import React from 'react';

const CardPreview = ({ config, svgRef }) => {
  const { 
    repoName, description, language, languageColor, stars, 
    bgColor, logoColor, titleColor, descColor, starColor, imageSrc,
    imgOpacity, imgBrightness, imgContrast, imgSaturation, imgHue, imgSharpness, imgVignette, imgVignetteFocus = 50, imgVignetteX = 50, imgVignetteY = 50, imgOverlay = 90, imgScale = 100
  } = config;

  // Filter calculations
  const c = imgContrast / 100;
  const b = (imgBrightness - 100) / 100;
  const intercept = 0.5 - 0.5 * c + b;
  const s = imgSharpness / 100; // 0 to 1
  const sharpnessKernel = `0 -${s} 0 -${s} ${1 + 4*s} -${s} 0 -${s} 0`;
  const hasFilter = imgHue != 0 || imgSaturation != 100 || imgContrast != 100 || imgBrightness != 100 || imgSharpness > 0;

  const wrapText = (text, maxChars) => {
    const rawLines = text.split('\n');
    const finalLines = [];
    rawLines.forEach(rawLine => {
      const words = rawLine.split(' ');
      let currentLine = '';
      words.forEach(word => {
        if ((currentLine + word).length > maxChars) {
          if (currentLine.length > 0) finalLines.push(currentLine.trim());
          currentLine = word + ' ';
        } else {
          currentLine += word + ' ';
        }
      });
      if (currentLine.length > 0) finalLines.push(currentLine.trim());
    });
    return finalLines.slice(0, 4);
  };

  const descriptionLines = wrapText(description, 36);

  return (
    <svg 
      ref={svgRef}
      width="800" 
      height="400" 
      viewBox="0 0 400 200" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ fontFamily: 'Arial, sans-serif', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
    >
      <defs>
        <clipPath id="card-clip">
          <rect width="400" height="200" rx="8" />
        </clipPath>
        
        <linearGradient id="overlay-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={bgColor === 'transparent' ? '#0d1117' : bgColor} stopOpacity={imgOverlay / 100} />
          <stop offset="60%" stopColor={bgColor === 'transparent' ? '#0d1117' : bgColor} stopOpacity={(imgOverlay / 100) * 0.55} />
          <stop offset="100%" stopColor={bgColor === 'transparent' ? '#0d1117' : bgColor} stopOpacity="0" />
        </linearGradient>

        <radialGradient id="vignette-grad" cx={`${imgVignetteX}%`} cy={`${imgVignetteY}%`}>
          <stop offset={`${imgVignetteFocus}%`} stopColor="black" stopOpacity="0" />
          <stop offset="100%" stopColor="black" stopOpacity={imgVignette / 100} />
        </radialGradient>

        {hasFilter && (
          <filter id="img-adjust" colorInterpolationFilters="sRGB">
            <feColorMatrix type="hueRotate" values={imgHue} />
            <feColorMatrix type="saturate" values={imgSaturation / 100} />
            <feComponentTransfer>
              <feFuncR type="linear" slope={c} intercept={intercept} />
              <feFuncG type="linear" slope={c} intercept={intercept} />
              <feFuncB type="linear" slope={c} intercept={intercept} />
            </feComponentTransfer>
            {imgSharpness > 0 && (
              <feConvolveMatrix order="3" kernelMatrix={sharpnessKernel} preserveAlpha="true" />
            )}
          </filter>
        )}
      </defs>

      {/* Background Color */}
      <rect width="400" height="200" fill={bgColor} rx="8" />

      {/* Full Background Image */}
      {imageSrc && (
        <g clipPath="url(#card-clip)">
          <image 
            href={imageSrc} 
            x={200 - 200 * (imgScale / 100)} 
            y={100 - 100 * (imgScale / 100)} 
            width={400 * (imgScale / 100)} 
            height={200 * (imgScale / 100)} 
            preserveAspectRatio="xMidYMid slice"
            opacity={imgOpacity / 100}
            filter={hasFilter ? 'url(#img-adjust)' : undefined}
          />
          
          {/* Vignette Layer */}
          {imgVignette > 0 && (
            <rect width="400" height="200" fill="url(#vignette-grad)" />
          )}

          {/* Overlay for text readability */}
          {imgOverlay > 0 && (
            <rect width="400" height="200" fill="url(#overlay-grad)" />
          )}
        </g>
      )}

      {/* Book Icon */}
      <svg x="16" y="16" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="2" width="18" height="18" rx="2" stroke={logoColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="3" y1="16" x2="21" y2="16" stroke={logoColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 16V23L12 21.5L14 23V16Z" fill={logoColor} />
        <rect x="6" y="4" width="2" height="2" fill={logoColor} />
        <rect x="6" y="7" width="2" height="2" fill={logoColor} />
        <rect x="6" y="10" width="2" height="2" fill={logoColor} />
        <rect x="6" y="13" width="2" height="2" fill={logoColor} />
      </svg>

      {/* Repo Name */}
      <text x="44" y="34" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill={titleColor}>
        {repoName}
      </text>

      {/* Description */}
      <text x="20" y="68" fontFamily="Arial, sans-serif" fontSize="13" fill={descColor}>
        {descriptionLines.map((line, i) => (
          <tspan key={i} x="20" dy={i === 0 ? 0 : 18}>
            {line}{i === 3 && description.length > 140 ? '...' : ''}
          </tspan>
        ))}
      </text>

      {/* Language */}
      <circle cx="26" cy="170" r="6" fill={languageColor} />
      <text x="38" y="174" fontFamily="Arial, sans-serif" fontSize="12" fill={starColor}>
        {language}
      </text>

      {/* Stars */}
      {Number(stars) > 0 && (
        <>
          <svg x="100" y="162" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z" fill={starColor}/>
          </svg>
          <text x="120" y="174" fontFamily="Arial, sans-serif" fontSize="12" fill={starColor}>
            {stars}
          </text>
        </>
      )}
    </svg>
  );
};

export default CardPreview;
