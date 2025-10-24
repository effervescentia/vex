import { Thumbmark } from '@thumbmarkjs/thumbmarkjs';
import { useEffect } from 'react';

export const Fingerprint: React.FC = () => {
  // TODO: implement me

  useEffect(() => {
    new Thumbmark().get().then((tm) => console.log(tm));
  }, []);

  return null;
};

/**
 * changes across browsers
 *
 * arc:
 * - permissions
 * - useragent
 * - browser
 *
 * chrome profiles:
 * - permissions
 *
 * firefox:
 * - no font reporting
 * - no canvas reporting
 * - audio.sampleHash
 * - hardware.videocard
 * - no hardware deviceMemory or jsHeapSizeLimit reporting
 * - locales
 * - permissions reporting
 * - plugins
 * - system productSub, useragent, browser
 *
 * safari:
 * - no canvas reporting
 * - no audio reporting
 * - missing fonts, different sizes
 * - hardware.videocard
 * - no hardware deviceMemory or jsHeapSizeLimit reporting
 * - locales
 * - math
 * - permissions reporting
 * - screen.colorDepth
 * - screen.mediaMatches
 * - useragent
 * - hardwareConcurrency
 * - browser
 * - applePayVersion
 * - cookieEnabled
 *
 * brave:
 * - audio.sampleHash
 * - canvas
 * - missing fonts
 * - deviceMemory
 * - permissions
 * - plugins
 * - useragent
 * - hardwareConcurrency
 * - browser
 *
 * opera:
 * - commonPixelHash
 * - permissions
 * - useragent
 * - browser
 */

/**
 * browser detection idea:
 *
 * frontend & backend negotiate a secret number
 * number is used to start a programmatic investigation of globals by stringifying and traversing their source code
 * this builds a unique key which should be comparable to other browsers of the same version on other operating systems
 */
