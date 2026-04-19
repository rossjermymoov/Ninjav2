'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Order, SalesChannel } from '@/types/order'
import { ChannelBadge } from './ChannelBadge'
import type { ChannelData } from '@/lib/channels'
import { CHANNEL_FALLBACKS } from '@/lib/channels'
import { colors, font, radii } from '@/lib/tokens'

// ─── Bulk action SVG icons (brand assets, kept verbatim) ─────────────────────

function IconBatch() {
  return (
    <svg width="18" height="18" viewBox="0 0 25 25" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M22.0665 14.7418C22.1623 14.7898 22.2558 14.8384 22.3471 14.8878C24.0423 15.8044 24.9668 16.9967 24.9668 18.2193C24.9668 19.442 24.0423 20.6342 22.3471 21.5511C20.1213 22.7544 16.5325 23.5516 12.4835 23.5516C8.43453 23.5516 4.84564 22.7544 2.61993 21.5511C0.924847 20.6342 0 19.442 0 18.2193C0 16.9967 0.924847 15.8044 2.61993 14.8878C2.70411 14.8422 2.79026 14.7973 2.8783 14.7529C2.89077 11.7167 2.92028 5.23935 2.92028 5.23935C2.92586 5.22008 2.93164 5.20026 2.93773 5.18068C3.11258 4.76101 3.5354 4.00832 4.49123 3.29255C4.64204 3.18981 4.79736 3.0926 4.9574 3.00046C6.06298 2.36288 7.25756 1.97911 8.49731 1.73241C9.85172 1.50452 11.9869 1.38383 13.6348 1.47668C15.2475 1.5676 16.2604 1.52125 18.3852 2.28971C20.7003 3.12693 22.0598 5.14929 22.0464 6.15132C22.0165 8.27744 22.0292 10.4046 22.0411 12.531C22.0436 12.9544 22.0561 13.8931 22.0665 14.7418ZM2.87292 16.2021C1.89062 16.7919 1.26775 17.4541 1.26775 18.2193C1.26775 19.072 2.04087 19.7966 3.22292 20.4358C5.31126 21.5648 8.68448 22.2838 12.4835 22.2838C16.2826 22.2838 19.6557 21.5648 21.7441 20.4358C22.9261 19.7966 23.699 19.072 23.699 18.2193C23.699 17.4507 23.0709 16.7861 22.0811 16.1944C22.0812 16.2185 22.0813 16.241 22.0813 16.2616C22.0813 17.1097 21.6255 17.9666 20.6566 18.6714C19.1207 19.7887 16.0409 20.6155 12.4771 20.6155C8.91328 20.6155 5.83342 19.7887 4.29746 18.6714C3.3286 17.9666 2.87287 17.1097 2.87287 16.2616C2.87287 16.2471 2.87287 16.2272 2.87292 16.2021ZM4.35593 15.4044C4.15385 15.6771 4.04579 15.9646 4.04579 16.2616C4.04579 18.0172 7.82373 19.4426 12.4771 19.4426C17.1304 19.4426 20.9084 18.0172 20.9084 16.2616C20.9084 15.8908 20.7399 15.5348 20.4303 15.2038C19.8033 15.6521 19.1008 15.974 18.3691 16.2405C16.7322 16.8361 15.0289 17.1015 13.2963 17.1757C11.7005 17.2441 10.1137 17.1374 8.54564 16.8126C7.16618 16.5268 5.83717 16.1029 4.6394 15.3383C4.60391 15.3156 4.56866 15.2927 4.53372 15.2695C4.4823 15.3133 4.42338 15.3583 4.35593 15.4044ZM15.2581 11.0713C15.2251 11.5179 15.252 11.969 15.252 12.4343C16.0288 12.3234 16.7834 12.156 17.5327 11.9204C17.4819 11.6668 17.5037 11.4172 17.4959 11.169C17.4759 10.5274 17.0325 10.0542 16.4355 10.0328C15.8183 10.0103 15.3049 10.4421 15.2581 11.0713ZM19.5835 14.4078C19.9007 14.2084 20.1759 13.9593 20.453 13.7106C20.3962 13.6529 20.3328 13.695 20.2781 13.7071C19.4333 13.8999 18.7122 13.6743 18.11 13.0611C18.0305 12.9797 17.9658 12.9694 17.866 13.003C17.6771 13.0664 17.4854 13.1189 17.2937 13.1718C16.6091 13.3598 15.9113 13.4881 15.219 13.5928C15.1913 13.691 15.1678 13.775 15.1446 13.8587C14.8947 14.7593 13.9951 15.4445 13.0665 15.4645C12.0581 15.487 11.1269 14.8375 10.8416 13.8531C10.8163 13.7652 10.7877 13.7023 10.6712 13.6955C10.0852 13.6598 9.50467 13.5751 8.92703 13.4726C7.75254 13.2636 6.61181 12.943 5.52606 12.4409C5.10162 12.2447 4.70147 12.0052 4.31481 11.7315C3.95908 12.1967 3.83463 12.6824 4.10117 13.2206C4.24138 13.504 4.44371 13.7412 4.67956 13.9501C5.34432 14.5388 6.13088 14.9099 6.95649 15.2041C8.26308 15.6692 9.61557 15.9003 10.9958 16.0009C12.9088 16.1399 14.8012 16.0255 16.6685 15.5744C17.6951 15.3267 18.6824 14.9738 19.5835 14.4078ZM4.31111 8.36304C3.83677 8.98185 3.84599 9.59382 4.3283 10.1936C4.75431 10.7224 5.31476 11.0699 5.9106 11.3639C6.91187 11.8575 7.97835 12.1478 9.07176 12.3488C9.6214 12.4496 10.175 12.517 10.7302 12.5685V10.3368C8.45745 10.0982 6.25791 9.66775 4.31111 8.36304Z" fill="#1A745A"/>
    </svg>
  )
}

function IconTag() {
  return (
    <svg width="18" height="18" viewBox="0 0 31 31" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M24.7173 16.8332C24.7181 16.8378 24.719 16.8429 24.7199 16.8475C24.7244 16.8726 24.7287 16.8967 24.7319 16.9217C24.7355 16.9465 24.7383 16.9715 24.7406 16.9961C24.7425 17.0208 24.7432 17.0458 24.7438 17.0703C24.7448 17.0958 24.7456 17.1213 24.7449 17.1462C24.7447 17.1714 24.7442 17.1967 24.7426 17.2218C24.741 17.2468 24.7387 17.2715 24.736 17.2968C24.7331 17.3217 24.7298 17.3461 24.7257 17.3712C24.7215 17.3959 24.7172 17.4216 24.7116 17.446C24.7065 17.4709 24.7004 17.4955 24.694 17.5201C24.6873 17.5454 24.6811 17.5694 24.6733 17.5939C24.6656 17.6184 24.657 17.6436 24.6478 17.6673C24.6387 17.6916 24.6289 17.7165 24.6184 17.7401C24.6082 17.7635 24.5977 17.7871 24.5863 17.8108C24.5748 17.8341 24.5617 17.8572 24.5488 17.8797C24.536 17.9028 24.523 17.9264 24.5089 17.9498C24.4948 17.9726 24.4801 17.994 24.4645 18.0161L24.1234 18.5074L23.9528 18.7544L23.781 19.0001L23.6105 19.2461L23.4397 19.4915L23.2691 19.7369L23.0985 19.9823L22.9277 20.2283L22.7571 20.4737L22.5862 20.7192L22.4157 20.9651L22.2451 21.2105L22.0745 21.4575L21.9027 21.7033L21.7322 21.9492L21.5613 22.1947L21.2202 22.686L21.0494 22.9315L20.7083 23.4228L20.5373 23.6677L20.3668 23.9137L20.1965 24.1606L20.0243 24.4064L19.8538 24.6518L19.6833 24.8977L19.5124 25.1432L19.3418 25.3886L19.1713 25.6345L19.0004 25.88C18.9849 25.9021 18.9686 25.9239 18.9522 25.9446C18.936 25.9664 18.9195 25.9871 18.9024 26.0075C18.885 26.0279 18.8673 26.0468 18.8492 26.0659C18.8308 26.0844 18.8126 26.1024 18.7942 26.1209C18.7751 26.138 18.7555 26.1569 18.7361 26.1736C18.7164 26.1908 18.6975 26.2063 18.6773 26.2221C18.657 26.2379 18.6365 26.2532 18.6155 26.2682C18.5946 26.2825 18.5737 26.2974 18.5521 26.3109C18.5305 26.3243 18.5085 26.3374 18.4867 26.3498C18.4647 26.3623 18.442 26.375 18.4193 26.386C18.3969 26.397 18.3742 26.4075 18.3514 26.4181C18.3283 26.4287 18.3047 26.4362 18.2816 26.4469C18.2584 26.4564 18.2344 26.4619 18.2113 26.472C18.1873 26.4791 18.1635 26.4894 18.1387 26.494C18.1153 26.5047 18.0907 26.5087 18.066 26.5133C18.0413 26.5169 18.0169 26.5219 17.9921 26.5265L17.9183 26.5397C17.8938 26.5442 17.8693 26.5429 17.8447 26.5469C17.8198 26.5494 17.7949 26.5535 17.7693 26.5519C17.7442 26.5529 17.7199 26.5547 17.6946 26.553C17.6695 26.5523 17.6442 26.5523 17.6192 26.5505C17.594 26.5493 17.5693 26.547 17.5441 26.5442C17.5192 26.5413 17.4935 26.5376 17.4685 26.5337C17.4434 26.5293 17.4182 26.5249 17.3936 26.5198C17.3687 26.5148 17.3438 26.5082 17.319 26.5021C17.2944 26.4954 17.2697 26.4882 17.2453 26.4804C17.2205 26.4727 17.1962 26.4654 17.172 26.4559C17.1477 26.4476 17.1244 26.4368 17.1005 26.4268C17.0765 26.4167 17.0531 26.4059 17.0295 26.3942C17.0061 26.3829 16.9826 26.3717 16.9593 26.3582C16.9362 26.3453 16.9136 26.3317 16.8908 26.317C16.868 26.3029 16.8449 26.2884 16.8226 26.2731L16.377 25.9638L15.9312 25.655L15.4838 25.3446L15.0379 25.0353L14.5921 24.7266L14.1465 24.4173L13.6995 24.1089L13.2533 23.7981L12.8074 23.4889L12.3616 23.1801L11.9147 22.8706L11.4687 22.5609L10.577 21.9424L10.1313 21.6331L9.68407 21.3231L9.23815 21.0139L8.34632 20.3954L7.89962 20.0869L7.45343 19.7762L7.00757 19.4669L6.56178 19.1582L6.11496 18.8492L5.66889 18.5389L4.77706 17.9205L4.33114 17.6112L3.88417 17.3012L3.43825 16.992L2.99239 16.6827C2.54617 16.3736 2.54587 16.3736 2.34723 15.2698L2.14927 14.1662L1.95002 13.0625L1.75185 11.958L1.55389 10.8544L1.3547 9.75071L1.15669 8.6472C1.15669 8.6472 1.08723 7.998 1.25856 7.75134L1.25793 7.74774C1.30903 7.67382 1.40118 7.60781 1.50532 7.55111L1.50209 7.54335C1.50209 7.54335 1.54271 7.52672 1.61814 7.49545C1.67216 7.47116 1.7265 7.44895 1.77781 7.42963C2.83316 6.99635 6.6496 5.43832 8.51988 4.79932C9.02089 4.62796 9.4022 4.52096 9.59103 4.49444C9.75519 4.47143 9.87811 4.48504 9.95583 4.50196L9.95613 4.50189L10.4392 4.60511L10.9221 4.70785L10.9228 4.70822L11.4056 4.8115L11.8901 4.91491L12.373 5.01765L12.3734 5.01809L12.8564 5.12082L13.3391 5.22413L13.8228 5.32667C13.8234 5.32651 13.8242 5.32685 13.825 5.32719L14.308 5.43096L14.7903 5.53385L14.7906 5.53377L15.757 5.74017L16.2415 5.84359L16.7246 5.9468L17.2076 6.05006L17.2079 6.04998L17.6907 6.15328L18.1742 6.25586C18.1748 6.25571 18.1755 6.25607 18.176 6.25593L18.6592 6.35968L19.1419 6.46301L19.6245 6.56582L20.1081 6.66836C20.1089 6.6687 20.1097 6.66904 20.1104 6.66887L20.5935 6.77317L21.0756 6.87556L21.0761 6.87598L21.5591 6.97921L22.0421 7.08194L22.0427 7.08231L22.5271 7.18574L23.01 7.28901L23.493 7.39175L23.4932 7.39168L23.9765 7.49487L24.4609 7.59829L24.9441 7.70148C24.9463 7.70199 24.9486 7.70251 24.9507 7.70304C24.9855 7.71091 25.0184 7.71819 25.0509 7.72717C25.0891 7.73687 25.1274 7.7487 25.1606 7.75966C25.199 7.77199 25.2373 7.78435 25.2749 7.79902C25.3072 7.8118 25.3383 7.82489 25.3665 7.83709C25.3999 7.85175 25.4335 7.86744 25.4654 7.883C25.4995 7.90017 25.5334 7.9179 25.5662 7.93647C25.5966 7.95349 25.6255 7.97194 25.6553 7.99073C25.6578 7.99224 25.6604 7.99374 25.663 7.99577C25.6922 8.01467 25.721 8.03371 25.7454 8.05117C25.7752 8.07208 25.8045 8.0942 25.8331 8.11648C25.8614 8.13887 25.8883 8.16104 25.915 8.18434C25.9165 8.18557 25.918 8.18681 25.9196 8.18856C25.9467 8.21229 25.972 8.23541 25.9977 8.26058C26.0227 8.28485 26.0467 8.30989 26.069 8.3343C26.0938 8.36077 26.1181 8.38896 26.1394 8.41469C26.1627 8.44207 26.1846 8.46817 26.2067 8.49747C26.2085 8.49969 26.2104 8.50243 26.2123 8.50465C26.2318 8.53135 26.2504 8.55831 26.2689 8.58529C26.2893 8.61552 26.3079 8.64568 26.3267 8.67687C26.3446 8.70667 26.3618 8.73557 26.378 8.7658C26.3949 8.79692 26.4113 8.82872 26.4262 8.85981C26.4273 8.86219 26.4287 8.86507 26.4298 8.86747C26.4445 8.89914 26.4578 8.93118 26.4695 8.9604C26.4838 8.99485 26.4974 9.02948 26.5089 9.06303C26.5204 9.09551 26.5313 9.12815 26.5412 9.16156C26.5518 9.19747 26.5612 9.23265 26.5696 9.26857C26.578 9.30397 26.5853 9.33807 26.5919 9.37444C26.5921 9.37546 26.5923 9.37648 26.5925 9.37751C26.5986 9.41187 26.6044 9.44686 26.6089 9.48164C26.6132 9.51432 26.6166 9.54777 26.6196 9.58184C26.6199 9.58498 26.6201 9.58761 26.6204 9.59076C26.6231 9.62599 26.6256 9.65964 26.6267 9.69474C26.6278 9.73144 26.628 9.76945 26.6269 9.80615C26.6261 9.84333 26.6243 9.88131 26.6215 9.91738C26.6191 9.95013 26.616 9.98251 26.6124 10.0166C26.6118 10.02 26.6114 10.0239 26.6109 10.0277C26.6063 10.0648 26.5996 10.1024 26.5929 10.14C26.5871 10.1725 26.5811 10.2062 26.5736 10.2391C26.5649 10.2788 26.5549 10.3173 26.5436 10.3565L26.3968 10.8778L26.3233 11.1401C26.3229 11.1413 26.3226 11.1424 26.3223 11.1436L26.2478 11.405L26.1743 11.6663L26.1742 11.6668L26.1 11.9287L26.0262 12.1906L25.9525 12.4524L25.9523 12.453L25.8783 12.7154L25.8043 12.9772L25.7303 13.2391L25.6565 13.5009L25.6564 13.5015L25.5828 13.7622L25.5096 14.0244C25.5092 14.0256 25.5089 14.0273 25.5085 14.0285L25.434 14.2899L25.3605 14.5511L25.3602 14.5523L25.2861 14.8136L25.1386 15.3373L25.1383 15.3384L25.0642 15.5998L24.9169 16.1239L24.9166 16.1251L24.8425 16.3864L24.7691 16.6465L24.7173 16.8332Z" fill="#1A745A"/>
    </svg>
  )
}

function IconMerge() {
  return (
    <svg width="18" height="18" viewBox="0 0 25 25" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M12.4998 19.5273C11.2723 20.241 9.84597 20.65 8.32499 20.65C3.73031 20.65 0 16.9192 0 12.3247C0 7.73026 3.73031 4 8.32499 4C9.84597 4 11.2723 4.40848 12.4998 5.12216C13.7274 4.40848 15.1537 4 16.6748 4C21.2694 4 25 7.73026 25 12.3247C25 16.9192 21.2694 20.65 16.6748 20.65C15.1537 20.65 13.7274 20.241 12.4998 19.5273ZM10.9742 6.25973C10.1629 5.90469 9.26681 5.70739 8.32499 5.70739C4.67279 5.70739 1.70764 8.67258 1.70764 12.3247C1.70764 15.9769 4.67279 18.9421 8.32499 18.9421C9.26681 18.9421 10.1629 18.7448 10.9742 18.3897C9.35903 16.8709 8.34976 14.7145 8.34976 12.3247C8.34976 9.93501 9.35903 7.77855 10.9742 6.25973ZM14.0255 18.3897C14.8369 18.7448 15.7329 18.9421 16.6748 18.9421C20.327 18.9421 23.2921 15.9769 23.2921 12.3247C23.2921 8.67258 20.327 5.70739 16.6748 5.70739C15.7329 5.70739 14.8369 5.90469 14.0255 6.25973C15.6407 7.77855 16.65 9.93501 16.65 12.3247C16.65 14.7145 15.6407 16.8709 14.0255 18.3897ZM13.6659 8.41927C13.331 7.96198 12.9387 7.5494 12.4998 7.19179C11.7533 7.80014 11.1417 8.56777 10.7172 9.44279L13.6659 8.41927ZM14.5646 10.1174C14.4343 9.74953 14.2723 9.39654 14.082 9.06153L10.356 10.3548C10.2244 10.7772 10.134 11.2175 10.0894 11.6707L14.5646 10.1174ZM14.9353 12.018C14.9168 11.6121 14.8616 11.2159 14.7729 10.8321L10.0589 12.4681C10.0677 12.8771 10.1135 13.2768 10.1933 13.6642L14.9353 12.018ZM14.704 14.0892C14.818 13.6771 14.893 13.2486 14.9249 12.8088L10.3848 14.3846C10.5042 14.7489 10.6545 15.0993 10.8325 15.4333L14.704 14.0892ZM12.4998 17.4577C13.3083 16.799 13.9584 15.9538 14.384 14.9873L11.2286 16.0827C11.5856 16.5986 12.0142 17.0621 12.4998 17.4577Z" fill="#1A745A"/>
    </svg>
  )
}

function IconInvoice() {
  return (
    <svg width="18" height="18" viewBox="0 0 25 25" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M3.2819 9.75508C3.23576 9.44524 3.33717 9.12627 3.56486 8.89807L12.1495 0.313384C12.114 0.348881 12.0821 0.386405 12.0527 0.425959L12.1856 0.293613C12.3737 0.105479 12.6288 0 12.8945 0H18.0623C20.0649 0 21.6906 1.62576 21.6906 3.62779V21.3286C21.6906 23.3306 20.0649 24.9564 18.0623 24.9564H6.90969C4.90715 24.9564 3.2819 23.3306 3.2819 21.3286V9.75508ZM5.289 10.6116V21.3286C5.289 22.2231 6.01516 22.9493 6.90969 22.9493H18.0623C18.9568 22.9493 19.683 22.2231 19.683 21.3286V3.62779C19.683 2.73327 18.9568 2.0071 18.0623 2.0071H13.863V7.73733C13.863 9.32455 12.576 10.6116 10.9883 10.6116H5.289ZM11.8554 3.45943L6.70432 8.60446H10.9883C11.4675 8.60446 11.8554 8.21603 11.8554 7.73733V3.45943ZM18.1237 15.8479V17.466C18.1237 17.7008 17.933 17.892 17.6977 17.892H7.27429C7.03951 17.892 6.84833 17.7008 6.84833 17.466V15.8479C6.84833 15.6126 7.03951 15.4219 7.27429 15.4219H17.6977C17.933 15.4219 18.1237 15.6126 18.1237 15.8479ZM18.1069 19.3266V20.9447C18.1069 21.18 17.9163 21.3707 17.681 21.3707H12.7692C12.5344 21.3707 12.3433 21.18 12.3433 20.9447V19.3266C12.3433 19.0918 12.5344 18.9011 12.7692 18.9011H17.681C17.9163 18.9011 18.1069 19.0918 18.1069 19.3266ZM18.1237 12.3687V13.9868C18.1237 14.2216 17.933 14.4128 17.6977 14.4128H7.27429C7.03951 14.4128 6.84833 14.2216 6.84833 13.9868V12.3687C6.84833 12.1339 7.03951 11.9427 7.27429 11.9427H17.6977C17.933 11.9427 18.1237 12.1339 18.1237 12.3687Z" fill="#1A745A"/>
    </svg>
  )
}

function IconActionCopy() {
  return (
    <svg width="18" height="18" viewBox="0 0 25 25" fill="none">
      <path d="M21 10H12C10.8954 10 10 10.8954 10 12V21C10 22.1046 10.8954 23 12 23H21C22.1046 23 23 22.1046 23 21V12C23 10.8954 22.1046 10 21 10Z" stroke="#1DFB9D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 16H5C4.46957 16 3.96086 15.7893 3.58579 15.4142C3.21071 15.0391 3 14.5304 3 14V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H14C14.5304 3 15.0391 3.21071 15.4142 3.58579C15.7893 3.96086 16 4.46957 16 5V6" stroke="#1DFB9D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconActionDelete() {
  return (
    <svg width="18" height="18" viewBox="0 0 25 25" fill="none">
      <path d="M20.9132 2.24841H17.0937C16.8457 2.24841 16.6082 2.14946 16.4328 1.97373L15.1108 0.647829C14.9354 0.472091 14.6976 0.373407 14.4496 0.373407H10.5502C10.3023 0.373407 10.0645 0.472091 9.88935 0.647829L8.56734 1.97373C8.39196 2.14946 8.15416 2.24841 7.9062 2.24841H4.08695C3.05432 2.24841 2.21729 3.08778 2.21729 4.12342C2.21729 5.15879 3.05432 5.99842 4.08695 5.99842V21.561C4.08695 23.1142 5.34241 24.3735 6.89132 24.3735H18.1088C19.6575 24.3735 20.9132 23.1142 20.9132 21.561V5.99842C21.9456 5.99842 22.7826 5.15879 22.7826 4.12342C22.7826 3.08778 21.9456 2.24841 20.9132 2.24841ZM10.6304 19.2172C10.6304 19.9938 10.0025 20.6235 9.22821 20.6235C8.45386 20.6235 7.82603 19.9938 7.82603 19.2172V9.2797C7.82603 8.5028 8.45386 7.87343 9.22821 7.87343C10.0025 7.87343 10.6304 8.5028 10.6304 9.2797V19.2172ZM17.1738 19.2172C17.1738 19.9938 16.5463 20.6235 15.7717 20.6235C14.9974 20.6235 14.3695 19.9938 14.3695 19.2172V9.2797C14.3695 8.5028 14.9974 7.87343 15.7717 7.87343C16.5463 7.87343 17.1738 8.5028 17.1738 9.2797V19.2172Z" fill="#1DFB9D"/>
    </svg>
  )
}

// ─── Filter pill ──────────────────────────────────────────────────────────────

function FilterPill({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <button style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '0 14px', height: 34, borderRadius: 99,
      background: active ? `${colors.mint}18` : colors.cardBg,
      border: `1px solid ${active ? colors.borderMint : colors.borderDim}`,
      color: colors.textPrimary,
      fontSize: font.size.xs, fontWeight: font.weight.semibold,
      fontFamily: font.family, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
      transition: 'all 0.15s',
    }}>
      {label}
      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
        <path d="M1 1l3 4 3-4" stroke={colors.mint} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )
}

// ─── Action button ────────────────────────────────────────────────────────────

function ActionBtn({ icon, label, disabled = false }: { icon: React.ReactNode; label: string; disabled?: boolean; mint?: boolean }) {
  return (
    <button
      disabled={disabled}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 4, padding: '7px 12px', borderRadius: radii.badge,
        background: colors.cardBg,
        border: `1px solid ${colors.borderMint}`,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.3 : 1,
        transition: 'opacity 0.15s, border-color 0.15s', minWidth: 52,
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.borderColor = colors.mint }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.borderColor = colors.borderMint }}
    >
      {icon}
      <span style={{
        fontSize: '9px', fontWeight: font.weight.semibold,
        color: colors.textSecondary, fontFamily: font.family, letterSpacing: '0.04em',
      }}>
        {label}
      </span>
    </button>
  )
}

// ─── Items badge ─────────────────────────────────────────────────────────────
// 1 item → green   2 items → purple   3+ items → red (count as text)

function ItemsBadge({ count }: { count: number }) {
  if (count === 1) {
    return (
      <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
        <circle cx="12.5" cy="12.5" r="12.5" fill="#1DFB9D"/>
        <path d="M10.2345 16.2059V14.9219H12.1785V9.04187H12.9225L10.4265 10.5299V9.06587L12.6225 7.74587H13.7265V14.9219H15.5505V16.2059H10.2345Z" fill="#FDFFFF"/>
      </svg>
    )
  }
  if (count === 2) {
    return (
      <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
        <circle cx="12.5" cy="12.5" r="12.5" fill="#6F4B9F"/>
        <path d="M9.83846 16.2059V15.0659L12.6465 12.1379C12.9985 11.7699 13.2585 11.4299 13.4265 11.1179C13.5945 10.8059 13.6785 10.4859 13.6785 10.1579C13.6785 9.74987 13.5505 9.44187 13.2945 9.23387C13.0385 9.02587 12.6665 8.92187 12.1785 8.92187C11.7865 8.92187 11.4105 8.99387 11.0505 9.13787C10.6905 9.27387 10.3385 9.48987 9.99446 9.78587L9.49046 8.63387C9.83446 8.32987 10.2585 8.08587 10.7625 7.90187C11.2745 7.71787 11.8105 7.62587 12.3705 7.62587C13.2825 7.62587 13.9825 7.82987 14.4705 8.23787C14.9585 8.64587 15.2025 9.22987 15.2025 9.98987C15.2025 10.5179 15.0785 11.0219 14.8305 11.5019C14.5825 11.9739 14.1985 12.4699 13.6785 12.9899L11.3385 15.3299V14.9219H15.5385V16.2059H9.83846Z" fill="#FDFFFF"/>
      </svg>
    )
  }
  // 3+ items — red circle with dynamic count
  return (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
      <circle cx="12.5" cy="12.5" r="12.5" fill="#CD1C69"/>
      <text
        x="12.5" y="17" textAnchor="middle"
        fill="#FDFFFF" fontSize="11" fontWeight="800"
        fontFamily="system-ui, sans-serif"
      >
        {count}
      </text>
    </svg>
  )
}

// ─── Tag pill ─────────────────────────────────────────────────────────────────

function tagColors(colour: string) {
  const map: Record<string, { bg: string; border: string; text: string }> = {
    green:  { bg: `${colors.mint}18`,             border: `${colors.mint}50`,             text: colors.mint },
    amber:  { bg: `${colors.statusProcessing}18`, border: `${colors.statusProcessing}50`, text: colors.statusProcessing },
    purple: { bg: `${colors.statusShipped}18`,    border: `${colors.statusShipped}50`,    text: colors.statusShipped },
    red:    { bg: `${colors.statusIssue}18`,      border: `${colors.statusIssue}50`,      text: colors.statusIssue },
  }
  return map[colour] ?? { bg: 'rgba(253,255,255,0.08)', border: 'rgba(253,255,255,0.20)', text: colors.textSecondary }
}

// ─── Status → left-border colour ─────────────────────────────────────────────

function statusBorderColor(status: string): string {
  switch (status) {
    case 'ready':            return colors.statusReady
    case 'processing':       return colors.statusProcessing
    case 'issue':            return colors.statusIssue
    case 'validation_error': return colors.statusIssue
    case 'error':            return colors.statusIssue
    default:                 return colors.borderSubtle
  }
}

function isErrorStatus(status: string) {
  return status === 'validation_error' || status === 'error'
}

// ─── Hamburger menu ───────────────────────────────────────────────────────────

const ORDER_MENU_OPTIONS = [
  { label: 'Order Details' },
  { label: 'Print Label' },
  { label: 'Multi Parcel' },
  { label: 'Copy' },
  { label: 'Delete', danger: true },
]

function OrderMenu({ orderId, onPrintLabel }: { orderId: string; onPrintLabel: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [orderId])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={e => { e.stopPropagation(); setOpen(v => !v) }}
        style={{
          width: 25, height: 26, background: 'none', border: 'none',
          padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center',
          justifyContent: 'center', opacity: open ? 1 : 0.85, transition: 'opacity 0.15s',
        }}
        aria-label="Order options"
      >
        <svg width="25" height="26" viewBox="0 0 25 26" fill="none">
          <g clipPath="url(#hbg-orders)">
            <ellipse cx="12.5" cy="12.6412" rx="12.5" ry="12.6412" fill="#171B2D"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M12.75 16.6864C13.7165 16.6864 14.5 17.4788 14.5 18.4562C14.5 19.4336 13.7165 20.226 12.75 20.226C11.7835 20.226 11 19.4336 11 18.4562C11 17.4788 11.7835 16.6864 12.75 16.6864ZM12.75 11.3771C13.7165 11.3771 14.5 12.1695 14.5 13.1469C14.5 14.1243 13.7165 14.9167 12.75 14.9167C11.7835 14.9167 11 14.1243 11 13.1469C11 12.1695 11.7835 11.3771 12.75 11.3771ZM14.5 7.83756C14.5 6.86015 13.7165 6.06779 12.75 6.06779C11.7835 6.06779 11 6.86015 11 7.83756C11 8.81498 11.7835 9.60734 12.75 9.60734C13.7165 9.60734 14.5 8.81498 14.5 7.83756Z" fill="#1DFB9D"/>
          </g>
          <defs>
            <clipPath id="hbg-orders">
              <rect width="25" height="25.2825" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 36, zIndex: 9999,
          background: '#FDFFFF', border: `1px solid ${colors.mint}`,
          borderRadius: 8, padding: '4px 0', minWidth: 180,
        }}>
          {ORDER_MENU_OPTIONS.map(opt => (
            <React.Fragment key={opt.label}>
              {opt.danger && <div style={{ height: 1, margin: '4px 12px', background: '#E8EAEF' }} />}
              <button
                onClick={e => {
                  e.stopPropagation()
                  setOpen(false)
                  if (opt.label === 'Order Details') router.push(`/orders/${orderId}`)
                  if (opt.label === 'Print Label') onPrintLabel()
                }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '9px 16px', background: 'transparent', border: 'none',
                  cursor: 'pointer', fontSize: '12px', fontFamily: font.family,
                  fontWeight: font.weight.semibold,
                  color: opt.danger ? colors.statusIssue : '#171B2D',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = opt.danger ? `${colors.statusIssue}12` : `${colors.mint}12`)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {opt.label}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Print Label Modal ────────────────────────────────────────────────────────

function PrintLabelModal({ orderId, onClose }: { orderId: string; onClose: () => void }) {
  const M = font.family
  const [dispatchDate, setDispatchDate]       = useState('Today')
  const [dispatchRef, setDispatchRef]         = useState('')
  const [shippingService, setShippingService] = useState('Royal Mail 48')
  const [weight, setWeight]                   = useState('1.2kg')
  const [packingSlips, setPackingSlips]       = useState(false)
  const [addTracking, setAddTracking]         = useState(false)

  void orderId // available for API calls

  // Wide dropdown pill with mint right-cap containing chevron
  function DropdownPill({ value }: { value: string }) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', borderRadius: 12.5, overflow: 'hidden',
        height: 25, flex: 1, background: 'rgba(253,255,255,0.20)', cursor: 'pointer',
      }}>
        <span style={{
          flex: 1, padding: '0 10px',
          color: colors.textPrimary, fontFamily: M, fontSize: 11,
          fontWeight: font.weight.semibold, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {value}
        </span>
        {/* Mint right cap — semicircle shape via border-radius on right side only */}
        <div style={{
          width: 30, height: '100%', flexShrink: 0,
          background: colors.mint,
          borderRadius: '0 12.5px 12.5px 0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
            <path d="M1 1l3 4 3-4" stroke="#171B2D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    )
  }

  // Narrow plain pill (editable or read-only value)
  function PlainPill({ value, onChange }: { value: string; onChange?: (v: string) => void }) {
    return (
      <div style={{
        width: 90, flexShrink: 0, borderRadius: 12.5,
        height: 25, background: 'rgba(253,255,255,0.20)',
        display: 'flex', alignItems: 'center', padding: '0 10px', overflow: 'hidden',
      }}>
        {onChange ? (
          <input
            value={value}
            onChange={e => onChange(e.target.value)}
            style={{
              background: 'none', border: 'none', outline: 'none',
              color: colors.textPrimary, fontFamily: M, fontSize: 11,
              fontWeight: font.weight.semibold, width: '100%',
            }}
          />
        ) : (
          <span style={{ color: colors.textPrimary, fontFamily: M, fontSize: 11, fontWeight: font.weight.semibold, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {value}
          </span>
        )}
      </div>
    )
  }

  // A labelled row: label text above, then wide dropdown + narrow pill side by side
  function FieldRow({ label1, dropdown1Value, pill1Value, onPill1Change, label2 }: {
    label1: string
    dropdown1Value: string
    pill1Value: string
    onPill1Change?: (v: string) => void
    label2: string
  }) {
    return (
      <div style={{ display: 'flex', gap: 10 }}>
        {/* Wide column: label + dropdown pill */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
          <span style={{ fontSize: 10, fontWeight: font.weight.semibold, color: 'rgba(253,255,255,0.55)', fontFamily: M, letterSpacing: '0.04em' }}>
            {label1}
          </span>
          <DropdownPill value={dropdown1Value} />
        </div>
        {/* Narrow column: label + plain pill */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <span style={{ fontSize: 10, fontWeight: font.weight.semibold, color: 'rgba(253,255,255,0.55)', fontFamily: M, letterSpacing: '0.04em' }}>
            {label2}
          </span>
          <PlainPill value={pill1Value} onChange={onPill1Change} />
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
        zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 560, background: '#171B2D', border: `1px solid ${colors.mint}`,
          borderRadius: 18, padding: '20px 24px 22px', position: 'relative',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 14, right: 14, width: 24, height: 24,
            borderRadius: '50%', background: 'rgba(253,255,255,0.10)',
            border: '1px solid rgba(253,255,255,0.20)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', padding: 0,
          }}
        >
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
            <path d="M1 1l8 8M9 1l-8 8" stroke="#FDFFFF" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Title */}
        <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: font.weight.bold, color: colors.textPrimary, fontFamily: M }}>
          Print Label
        </h3>

        {/* Main content: 3D box + fields */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

          {/* Isometric 3D box illustration */}
          <div style={{ flexShrink: 0, width: 130 }}>
            <svg width="130" height="112" viewBox="0 0 136 116" fill="none">
              <path d="M68 6 L118 34 L68 62 L18 34 Z" fill="#1DFB9D"/>
              <path d="M118 34 L118 82 L68 110 L68 62 Z" fill="#17D080"/>
              <path d="M68 62 L68 110 L18 82 L18 34 Z" fill="#0E9E63"/>
              <path d="M68 6 L68 62" stroke="#171B2D" strokeWidth="5" strokeOpacity="0.25"/>
              <path d="M18 34 L118 34" stroke="#171B2D" strokeWidth="5" strokeOpacity="0.25"/>
              <path d="M93 48 L93 96" stroke="#171B2D" strokeWidth="4" strokeOpacity="0.2"/>
              <path d="M43 48 L43 96" stroke="#171B2D" strokeWidth="4" strokeOpacity="0.2"/>
            </svg>
          </div>

          {/* Fields section */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Row 1: Dispatch Date + Ref */}
            <FieldRow
              label1="Dispatch Date"
              dropdown1Value={dispatchDate}
              label2="Ref"
              pill1Value={dispatchRef}
              onPill1Change={setDispatchRef}
            />

            {/* Row 2: Shipping Service + Weight */}
            <FieldRow
              label1="Shipping Service"
              dropdown1Value={shippingService}
              label2="Weight"
              pill1Value={weight}
              onPill1Change={setWeight}
            />

            {/* Legend row: two checkbox squares + labels */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {/* Checkbox 1 */}
              <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}>
                <div
                  onClick={() => setPackingSlips(v => !v)}
                  style={{
                    width: 9, height: 9, borderRadius: 2, flexShrink: 0,
                    background: packingSlips ? colors.mint : '#DFE0EB',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  {packingSlips && (
                    <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
                      <path d="M1 2.5l1.5 1.5L6 1" stroke="#171B2D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: 10, fontWeight: font.weight.semibold, color: 'rgba(253,255,255,0.65)', fontFamily: M }}>
                  Include packing slips
                </span>
              </label>
              {/* Checkbox 2 */}
              <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}>
                <div
                  onClick={() => setAddTracking(v => !v)}
                  style={{
                    width: 9, height: 9, borderRadius: 2, flexShrink: 0,
                    background: addTracking ? colors.mint : '#DFE0EB',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  {addTracking && (
                    <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
                      <path d="M1 2.5l1.5 1.5L6 1" stroke="#171B2D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: 10, fontWeight: font.weight.semibold, color: 'rgba(253,255,255,0.65)', fontFamily: M }}>
                  Add tracking info
                </span>
              </label>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{
                width: 98, height: 35, borderRadius: 17.5, background: colors.mint,
                border: 'none', color: '#171B2D', fontSize: 12,
                fontWeight: font.weight.bold, fontFamily: M, cursor: 'pointer',
              }}>
                Get Quote
              </button>
              <button style={{
                width: 98, height: 35, borderRadius: 17.5, background: colors.mint,
                border: 'none', color: '#171B2D', fontSize: 12,
                fontWeight: font.weight.bold, fontFamily: M, cursor: 'pointer',
              }}>
                Process
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Grid template (shared between header and rows) ───────────────────────────
// checkbox | customer | date+time | order no. | channel | sku+items | destination | menu
const GRID = '36px 1fr 95px 120px 155px 1fr 120px 44px'
const COLS  = ['', 'Customer', 'Date & Time', 'Order No.', 'Channel', 'SKU & Items', 'Destination', '']

// ─── Column header ────────────────────────────────────────────────────────────

function TableHeader({ allSelected, onToggleAll }: { allSelected: boolean; onToggleAll: () => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: GRID, gap: 8, padding: '6px 16px 8px', alignItems: 'center' }}>
      {/* Select-all checkbox */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <input
          type="checkbox" checked={allSelected} onChange={onToggleAll}
          style={{ accentColor: colors.mint, width: 14, height: 14, cursor: 'pointer' }}
        />
      </div>
      {COLS.slice(1).map((h, i) => (
        <span key={i} style={{
          fontSize: font.size.xs, fontWeight: font.weight.bold,
          color: colors.textMuted, fontFamily: font.family,
          textTransform: 'uppercase', letterSpacing: '0.07em',
        }}>
          {h}
        </span>
      ))}
    </div>
  )
}

// ─── Order row ────────────────────────────────────────────────────────────────

function OrderRow({ order, channelMap, selected, onToggle, onPrintLabel }: {
  order: Order
  channelMap: Record<string, ChannelData>
  selected: boolean
  onToggle: () => void
  onPrintLabel: () => void
}) {
  const M   = font.family
  const PRI = '#171B2D'   // primary text
  const SEC = '#6F4B9F'   // secondary text (purple)
  const leftBorder = statusBorderColor(order.status)
  const hasError   = isErrorStatus(order.status)
  const errorMsg   = order.validationError ?? order.processingError
  const errorLabel = order.status === 'validation_error' ? 'Validation Error' : 'Processing Error'
  const rowBorder  = hasError
    ? `1px solid ${colors.statusIssue}50`
    : selected ? `1px solid ${colors.borderMint}` : '1px solid #E4E6ED'

  // SKU display — max 2, remainder shown as red +N badge
  const visibleSkus  = order.sku.slice(0, 2)
  const extraSkuCount = order.sku.length - visibleSkus.length

  return (
    <div
      style={{
        borderRadius: radii.card,
        border: rowBorder,
        borderLeft: `3px solid ${leftBorder}`,
        marginBottom: 6,
        background: '#fff',
        boxShadow: hasError
          ? `0 0 14px ${colors.statusIssue}18`
          : selected ? `0 0 0 1px ${colors.mint}30` : '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
    >
    <div
      onClick={onToggle}
      style={{
        display: 'grid', gridTemplateColumns: GRID,
        alignItems: 'center', gap: 8, padding: '11px 16px',
        cursor: 'pointer', userSelect: 'none',
      }}
    >
      {/* Checkbox */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onClick={e => e.stopPropagation()}>
        <input
          type="checkbox" checked={selected} onChange={onToggle}
          style={{ accentColor: colors.mint, width: 14, height: 14, cursor: 'pointer' }}
        />
      </div>

      {/* Customer name + tags */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, overflow: 'hidden', minWidth: 0 }}>
        <span style={{
          fontSize: '13px', fontWeight: font.weight.semibold, color: PRI,
          fontFamily: M, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {order.customerName}
        </span>
        {order.tags.length > 0 && (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {order.tags.map(tag => {
              const tc = tagColors(tag.colour)
              return (
                <span key={tag.id} style={{
                  padding: '1px 7px', borderRadius: 99,
                  background: tc.bg, border: `1px solid ${tc.border}`, color: tc.text,
                  fontSize: '10px', fontWeight: font.weight.bold, fontFamily: M,
                }}>
                  {tag.label}
                </span>
              )
            })}
          </div>
        )}
      </div>

      {/* Date & time */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <span style={{ fontSize: '13px', fontWeight: font.weight.semibold, color: PRI, fontFamily: M }}>
          {order.createdAt.split(' ')[0]}
        </span>
        <span style={{ fontSize: '12px', color: SEC, fontFamily: M }}>
          {order.createdAt.split(' ')[1]}
        </span>
      </div>

      {/* Order number — external ID above (primary), internal #ref below (secondary) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden', minWidth: 0 }}>
        <span style={{
          fontSize: '13px', fontWeight: font.weight.semibold, color: PRI, fontFamily: M,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          minHeight: 16, display: 'block', letterSpacing: '0.02em',
        }}>
          {order.externalOrderId ?? ''}
        </span>
        <span style={{
          fontSize: '12px', fontWeight: font.weight.semibold, color: SEC,
          fontFamily: M, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {order.orderNumber}
        </span>
      </div>

      {/* Channel */}
      <div>
        <ChannelBadge
          storeName={order.channelStoreName}
          channel={channelMap[order.channel] ?? CHANNEL_FALLBACKS[order.channel as SalesChannel]}
        />
      </div>

      {/* SKU + items badge — merged column, max 2 SKUs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden', minWidth: 0 }}>
        <div style={{ flexShrink: 0 }}>
          <ItemsBadge count={order.itemCount} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, overflow: 'hidden', minWidth: 0, flex: 1 }}>
          {/* First SKU row — text + optional + badge inline to the right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, overflow: 'hidden', minWidth: 0 }}>
            <span style={{
              fontSize: '13px', fontWeight: font.weight.semibold, color: PRI,
              fontFamily: M, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
            }}>
              {visibleSkus[0]}
            </span>
            {extraSkuCount > 0 && (
              <svg width="16" height="16" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="6" cy="6" r="6" fill="#CD1C69"/>
                <path d="M5.508 8.916V6.372H3V5.484H5.508V3H6.42V5.484H8.928V6.372H6.42V8.916H5.508Z" fill="white"/>
              </svg>
            )}
          </div>
          {/* Second SKU row */}
          {visibleSkus.length > 1 && (
            <span style={{
              fontSize: '12px', fontWeight: font.weight.semibold, color: SEC,
              fontFamily: M, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {visibleSkus[1]}
            </span>
          )}
        </div>
      </div>

      {/* Destination — flag + postcode (primary) + country code (secondary) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{order.countryFlag}</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, overflow: 'hidden', minWidth: 0 }}>
          <span style={{
            fontSize: '13px', fontWeight: font.weight.semibold, color: PRI,
            fontFamily: M, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {order.postcode}
          </span>
          <span style={{ fontSize: '12px', color: SEC, fontFamily: M }}>
            {order.countryCode}
          </span>
        </div>
      </div>

      {/* Hamburger */}
      <div onClick={e => e.stopPropagation()}>
        <OrderMenu orderId={order.id} onPrintLabel={onPrintLabel} />
      </div>
    </div>

    {/* Error strip — shown for validation_error and error statuses */}
    {hasError && errorMsg && (
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        padding: '9px 16px 10px',
        background: `${colors.statusIssue}12`,
        borderTop: `1px solid ${colors.statusIssue}30`,
        borderRadius: `0 0 ${radii.card}px ${radii.card}px`,
      }}>
        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
          <path fillRule="evenodd" clipRule="evenodd"
            d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 4a1 1 0 011 1v3a1 1 0 11-2 0V7a1 1 0 011-1zm0 7a1 1 0 100 2 1 1 0 000-2z"
            fill={colors.statusIssue}
          />
        </svg>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: font.size.xs, fontWeight: font.weight.extrabold,
            color: colors.statusIssue, fontFamily: M, textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            {errorLabel}
          </span>
          <span style={{
            fontSize: font.size.sm, fontWeight: font.weight.semibold,
            color: colors.statusIssue, fontFamily: M, opacity: 0.85,
          }}>
            {errorMsg}
          </span>
        </div>
      </div>
    )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function OrdersTable({
  orders,
  total,
  channelMap = {},
}: {
  orders: Order[]
  total: number
  channelMap?: Record<string, ChannelData>
}) {
  const [selected, setSelected]               = useState<Set<string>>(new Set())
  const [allSelected, setAllSelected]         = useState(false)
  const [page, setPage]                       = useState(1)
  const [perPage, setPerPage]                 = useState(10)
  const [showExtraFilters, setShowExtraFilters] = useState(false)
  const [printLabelOrderId, setPrintLabelOrderId] = useState<string | null>(null)
  const M = font.family

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set()); setAllSelected(false)
    } else {
      setSelected(new Set(orders.map(o => o.id))); setAllSelected(true)
    }
  }

  const toggleRow = (id: string) => {
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelected(next)
    setAllSelected(next.size === orders.length)
  }

  const totalPages = Math.ceil(total / perPage)

  return (
    <>
    {printLabelOrderId && (
      <PrintLabelModal orderId={printLabelOrderId} onClose={() => setPrintLabelOrderId(null)} />
    )}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── Header ───────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: font.size['2xl'], fontWeight: font.weight.extrabold, color: colors.textPrimary, fontFamily: M }}>
              Orders
            </h1>
            <p style={{ margin: '3px 0 0', fontSize: font.size.sm, color: colors.textSecondary, fontFamily: M }}>
              {total.toLocaleString()} total orders
            </p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '4px 14px', borderRadius: 99,
            background: colors.cardBg, border: `1px solid ${colors.borderMint}`,
            color: colors.mint, fontSize: font.size.md, fontWeight: font.weight.bold, fontFamily: M,
          }}>
            {total}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {['Import Orders', 'Export Orders'].map(label => (
            <button key={label} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '0 16px', height: 36, borderRadius: 99,
              border: `1px solid ${colors.borderMint}`, background: colors.cardBg,
              color: colors.textPrimary, fontSize: font.size.xs, fontWeight: font.weight.semibold,
              fontFamily: M, cursor: 'pointer', transition: 'background 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = `${colors.mint}12`)}
              onMouseLeave={e => (e.currentTarget.style.background = colors.cardBg)}
            >
              {label}
              <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                <path d="M1 1l3 4 3-4" stroke={colors.mint} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* ── Filter bar row 1 ─────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <FilterPill label="Favourite Filters" />
        <FilterPill label="Date Range" />
        <FilterPill label="Sales Channel" />
        <FilterPill label="Delivery Service" />
        <FilterPill label="Sort Orders" />
        <FilterPill label="Tags" />

        {/* Bookmark */}
        <button style={{
          width: 34, height: 34, borderRadius: '50%',
          border: `1px solid ${colors.borderDim}`, background: colors.cardBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <svg width="13" height="16" viewBox="0 0 16 20" fill="none">
            <path d="M0 18.5V1H16V18.5L8.5 12.7L0 18.5Z" fill={colors.mint}/>
          </svg>
        </button>

        {/* Clear filters */}
        <button style={{
          width: 34, height: 34, borderRadius: '50%',
          border: `1px solid ${colors.borderDim}`, background: colors.cardBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <svg width="16" height="18" viewBox="0 0 20 22" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M11.8 12.43C11.55 12.67 11.41 13 11.41 13.35V19.41L7.49 22.98V13.36C7.49 13.01 7.34 12.68 7.09 12.44C5.79 11.22 1.7 7.37 0.41 6.15C0.15 5.92 0.01 5.58 0.01 5.24C0 4.19 0 2 0 2H18.88C18.88 2 18.88 4.17 18.89 5.21C18.89 5.56 18.75 5.89 18.49 6.13C17.2 7.35 13.1 11.21 11.8 12.43Z" fill={colors.mintDim}/>
          </svg>
        </button>

        {/* Expand extra filters */}
        <button
          onClick={() => setShowExtraFilters(v => !v)}
          style={{
            width: 34, height: 34, borderRadius: '50%',
            border: `1px solid ${showExtraFilters ? colors.borderMint : colors.borderDim}`,
            background: showExtraFilters ? `${colors.mint}18` : colors.cardBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          <svg width="10" height="8" viewBox="0 0 12 8" fill="none"
            style={{ transform: showExtraFilters ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
            <path d="M1 1l5 6 5-6" stroke={colors.mint} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* ── Bulk action buttons ─────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          marginLeft: 'auto', borderLeft: `1px solid ${colors.borderSubtle}`, paddingLeft: 12,
        }}>
          <ActionBtn icon={<IconBatch />}        label="Batch"   disabled={selected.size < 1} />
          <ActionBtn icon={<IconTag />}          label="Tag"     disabled={selected.size < 1} />
          <ActionBtn icon={<IconMerge />}        label="Merge"   disabled={selected.size < 2} />
          <ActionBtn icon={<IconInvoice />}      label="Invoice" disabled={selected.size < 1} />
          <ActionBtn icon={<IconActionCopy />}   label="Copy"    disabled={selected.size < 1} />
          <ActionBtn icon={<IconActionDelete />} label="Delete"  disabled={selected.size < 2} />
        </div>
      </div>

      {/* ── Filter bar row 2 (expandable) ────────────────────────── */}
      {showExtraFilters && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <FilterPill label="SKU" />
          <FilterPill label="Destination" />
          <FilterPill label="Order Type" />
          <FilterPill label="Item Quantity" />
        </div>
      )}

      {/* ── Select-all bar (shown when rows selected) ─────────────── */}
      {selected.size > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 16px', borderRadius: 10,
          background: `${colors.mint}12`, border: `1px solid ${colors.borderMint}`,
        }}>
          <input
            type="checkbox" checked={allSelected} onChange={toggleAll}
            style={{ accentColor: colors.mint, width: 14, height: 14, cursor: 'pointer' }}
          />
          <span style={{ fontSize: font.size.sm, fontWeight: font.weight.semibold, color: colors.mint, fontFamily: M }}>
            {selected.size} order{selected.size !== 1 ? 's' : ''} selected
          </span>
          <button
            onClick={() => { setSelected(new Set()); setAllSelected(false) }}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: font.size.xs, color: colors.textMuted, fontFamily: M }}
          >
            Clear
          </button>
        </div>
      )}

      {/* ── Table ────────────────────────────────────────────────── */}
      <div>
        <TableHeader allSelected={allSelected} onToggleAll={toggleAll} />
        {orders.length === 0 && (
          <p style={{ margin: '24px 0', textAlign: 'center', color: colors.textMuted, fontFamily: M, fontSize: font.size.sm }}>
            No orders found.
          </p>
        )}
        {orders.map(order => (
          <OrderRow
            key={order.id}
            order={order}
            channelMap={channelMap}
            selected={selected.has(order.id)}
            onToggle={() => toggleRow(order.id)}
            onPrintLabel={() => setPrintLabelOrderId(order.id)}
          />
        ))}
      </div>

      {/* ── Pagination ───────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
        <span style={{ fontSize: font.size.xs, color: colors.textMuted, fontFamily: M }}>Orders per page</span>
        {[10, 50, 100].map(n => (
          <button key={n} onClick={() => setPerPage(n)} style={{
            width: 34, height: 34, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: perPage === n ? colors.mint : colors.cardBg,
            color: perPage === n ? colors.pageBg : colors.textPrimary,
            border: perPage === n ? 'none' : `1px solid ${colors.borderSubtle}`,
            fontSize: font.size.xs, fontWeight: font.weight.bold, fontFamily: M, cursor: 'pointer',
          }}>
            {n}
          </button>
        ))}

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{
            width: 34, height: 34, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: `1px solid ${colors.borderSubtle}`,
            cursor: page === 1 ? 'default' : 'pointer', opacity: page === 1 ? 0.3 : 1,
          }}>
            <ChevronLeft size={14} color={colors.textPrimary} />
          </button>
          <button style={{
            width: 34, height: 34, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: colors.mint, color: colors.pageBg,
            fontSize: font.size.xs, fontWeight: font.weight.bold, fontFamily: M, border: 'none', cursor: 'default',
          }}>
            {page}
          </button>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{
            width: 34, height: 34, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: `1px solid ${colors.borderSubtle}`,
            cursor: page === totalPages ? 'default' : 'pointer', opacity: page === totalPages ? 0.3 : 1,
          }}>
            <ChevronRight size={14} color={colors.textPrimary} />
          </button>
        </div>
      </div>

    </div>
    </>
  )
}
