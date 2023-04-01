export const AttachmentIconEnum = {
    getIcon(name,size){
        let ext = this.getExt(name);
        size = size || 40;
        if(ext == 'jpg'){
            return  `<svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M6 2C5.44772 2 5 2.44772 5 3V37C5 37.5523 5.44772 38 6 38H34C34.5523 38 35 37.5523 35 37V11L30.5 6.5L26 2H6Z" fill="#597EF7"/>
<path d="M35 11L27 11C26.4477 11 26 10.5523 26 10L26 2L30.5 6.5L35 11Z" fill="#85A5FF"/>
<path d="M12.248 16.4317V22.1917C12.248 22.8277 12.128 23.2837 11.912 23.5717C11.684 23.8597 11.324 24.0157 10.82 24.0157C9.93199 24.0157 9.48799 23.4997 9.48799 22.4797V22.2037H8.17999V22.4917C8.17999 23.3317 8.40799 23.9797 8.86399 24.4597C9.29599 24.9277 9.94399 25.1677 10.796 25.1677C11.78 25.1677 12.5 24.9037 12.956 24.3997C13.352 23.9197 13.556 23.1997 13.556 22.2397V16.4317H12.248Z" fill="white"/>
<path d="M15.2384 16.4317V24.9997H16.5464V21.6637H18.7664C20.8184 21.6637 21.8504 20.7877 21.8504 19.0357C21.8504 17.2957 20.8304 16.4317 18.7904 16.4317H15.2384ZM16.5464 17.5477H18.6824C19.3184 17.5477 19.7864 17.6677 20.0864 17.9077C20.3864 18.1237 20.5424 18.5077 20.5424 19.0357C20.5424 19.5637 20.3864 19.9477 20.0984 20.1877C19.7984 20.4277 19.3304 20.5477 18.6824 20.5477H16.5464V17.5477Z" fill="white"/>
<path d="M26.7746 16.2637C25.5146 16.2637 24.5066 16.6957 23.7626 17.5837C23.0546 18.4117 22.7066 19.4677 22.7066 20.7517C22.7066 22.0237 23.0546 23.0677 23.7626 23.8717C24.5186 24.7357 25.5746 25.1677 26.9426 25.1677C27.6866 25.1677 28.3706 25.0717 28.9946 24.8797C29.5826 24.6877 30.0986 24.4237 30.5426 24.0757V20.4757H26.8706V21.5917H29.2346V23.4517C28.9466 23.6317 28.6346 23.7757 28.2746 23.8717C27.9026 23.9677 27.5066 24.0277 27.0866 24.0277C26.0186 24.0277 25.2266 23.7277 24.7226 23.1277C24.2426 22.5757 24.0146 21.7837 24.0146 20.7517C24.0146 19.6957 24.2666 18.8677 24.7946 18.2677C25.2866 17.6917 25.9466 17.4157 26.7746 17.4157C27.4466 17.4157 27.9986 17.5597 28.4066 17.8597C28.8146 18.1477 29.0786 18.5797 29.1986 19.1557H30.5186C30.3626 18.1957 29.9786 17.4877 29.3666 17.0077C28.7306 16.5037 27.8666 16.2637 26.7746 16.2637Z" fill="white"/>
</svg>
`;
        }
        if(ext == 'pdf'){
            return  `<svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M6 2C5.44772 2 5 2.44772 5 3V37C5 37.5523 5.44772 38 6 38H34C34.5523 38 35 37.5523 35 37V11L30.5 6.5L26 2H6Z" fill="#FA541C"/>
<path d="M35 11L27 11C26.4477 11 26 10.5523 26 10L26 2L30.5 6.5L35 11Z" fill="#FF9C6E"/>
<path d="M8.84 16.4316V24.9996H10.148V21.6636H12.368C14.42 21.6636 15.452 20.7876 15.452 19.0356C15.452 17.2956 14.432 16.4316 12.392 16.4316H8.84ZM10.148 17.5476H12.284C12.92 17.5476 13.388 17.6676 13.688 17.9076C13.988 18.1236 14.144 18.5076 14.144 19.0356C14.144 19.5636 13.988 19.9476 13.7 20.1876C13.4 20.4276 12.932 20.5476 12.284 20.5476H10.148V17.5476Z" fill="white"/>
<path d="M16.6681 16.4316V24.9996H19.7641C21.1441 24.9996 22.1881 24.6156 22.9081 23.8476C23.5921 23.1036 23.9401 22.0596 23.9401 20.7156C23.9401 19.3596 23.6041 18.3156 22.9321 17.5956C22.2121 16.8156 21.1681 16.4316 19.7881 16.4316H16.6681ZM17.9761 17.5476H19.5481C20.6281 17.5476 21.4201 17.7996 21.9241 18.3156C22.4041 18.8196 22.6561 19.6116 22.6561 20.7156C22.6561 21.7956 22.4041 22.5876 21.9121 23.1036C21.4081 23.6196 20.6041 23.8836 19.5241 23.8836H17.9761V17.5476Z" fill="white"/>
<path d="M25.2697 16.4316V24.9996H26.5777V21.1596H30.8377V20.0436H26.5777V17.5476H31.0897V16.4316H25.2697Z" fill="white"/>
</svg>

`;
        }
        if(ext == 'png'){
            return  `<svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M6 2C5.44772 2 5 2.44772 5 3V37C5 37.5523 5.44772 38 6 38H34C34.5523 38 35 37.5523 35 37V11L30.5 6.5L26 2H6Z" fill="#597EF7"/>
<path d="M35 11L27 11C26.4477 11 26 10.5523 26 10L26 2L30.5 6.5L35 11Z" fill="#85A5FF"/>
<path d="M7.84 16.4317V24.9997H9.148V21.6637H11.368C13.42 21.6637 14.452 20.7877 14.452 19.0357C14.452 17.2957 13.432 16.4317 11.392 16.4317H7.84ZM9.148 17.5477H11.284C11.92 17.5477 12.388 17.6677 12.688 17.9077C12.988 18.1237 13.144 18.5077 13.144 19.0357C13.144 19.5637 12.988 19.9477 12.7 20.1877C12.4 20.4277 11.932 20.5477 11.284 20.5477H9.148V17.5477Z" fill="white"/>
<path d="M15.6681 16.4317V24.9997H16.9761V18.5557H17.0241L21.4521 24.9997H22.7241V16.4317H21.4161V22.8037H21.3681L16.9881 16.4317H15.6681Z" fill="white"/>
<path d="M28.1183 16.2637C26.8583 16.2637 25.8503 16.6957 25.1063 17.5837C24.3983 18.4117 24.0503 19.4677 24.0503 20.7517C24.0503 22.0237 24.3983 23.0677 25.1063 23.8717C25.8623 24.7357 26.9183 25.1677 28.2863 25.1677C29.0303 25.1677 29.7143 25.0717 30.3383 24.8797C30.9263 24.6877 31.4423 24.4237 31.8863 24.0757V20.4757H28.2143V21.5917H30.5783V23.4517C30.2903 23.6317 29.9783 23.7757 29.6183 23.8717C29.2463 23.9677 28.8503 24.0277 28.4303 24.0277C27.3623 24.0277 26.5703 23.7277 26.0663 23.1277C25.5863 22.5757 25.3583 21.7837 25.3583 20.7517C25.3583 19.6957 25.6103 18.8677 26.1383 18.2677C26.6303 17.6917 27.2903 17.4157 28.1183 17.4157C28.7903 17.4157 29.3423 17.5597 29.7503 17.8597C30.1583 18.1477 30.4223 18.5797 30.5423 19.1557H31.8623C31.7063 18.1957 31.3223 17.4877 30.7103 17.0077C30.0743 16.5037 29.2103 16.2637 28.1183 16.2637Z" fill="white"/>
</svg>


`;
        }
        if(ext == 'tif'){
            return  `<svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M6 2C5.44772 2 5 2.44772 5 3V37C5 37.5523 5.44772 38 6 38H34C34.5523 38 35 37.5523 35 37V11L30.5 6.5L26 2H6Z" fill="#597EF7"/>
<path d="M35 11L27 11C26.4477 11 26 10.5523 26 10L26 2L30.5 6.5L35 11Z" fill="#85A5FF"/>
<path d="M11.18 16.4316V17.5476H14.048V24.9996H15.344V17.5476H18.2V16.4316H11.18Z" fill="white"/>
<path d="M19.2585 16.4316V24.9996H20.5545V16.4316H19.2585Z" fill="white"/>
<path d="M22.258 16.4316V24.9996H23.566V21.1596H27.826V20.0436H23.566V17.5476H28.078V16.4316H22.258Z" fill="white"/>
</svg>



`;
        }
        if(ext == 'exe'){
            return  `<svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M6 2C5.44772 2 5 2.44772 5 3V37C5 37.5523 5.44772 38 6 38H34C34.5523 38 35 37.5523 35 37V11L30.5 6.5L26 2H6Z" fill="#9254DE"/>
<path d="M35 11L27 11C26.4477 11 26 10.5523 26 10L26 2L30.5 6.5L35 11Z" fill="#B37FEB"/>
<path d="M13.3929 18.6289C12.4809 18.6289 11.7489 18.9409 11.2209 19.5769C10.6689 20.2009 10.4049 20.9689 10.4049 21.8929C10.4049 22.9129 10.6929 23.7169 11.2689 24.3169C11.7969 24.8809 12.5289 25.1689 13.4409 25.1689C14.2689 25.1689 14.9529 24.9289 15.4929 24.4609C15.9249 24.0769 16.2009 23.5849 16.3449 23.0089H15.0729C14.9049 23.3689 14.7249 23.6449 14.5089 23.8129C14.2329 24.0169 13.8729 24.1249 13.4289 24.1249C12.9249 24.1249 12.5289 23.9569 12.2409 23.6449C11.9529 23.3209 11.7969 22.8529 11.7489 22.2529H16.4529C16.4409 21.1489 16.1889 20.2849 15.7089 19.6609C15.1809 18.9649 14.4009 18.6289 13.3929 18.6289ZM13.4289 19.6729C14.4369 19.6729 15.0009 20.2129 15.1209 21.2929H11.7729C11.8449 20.7649 12.0249 20.3689 12.2889 20.0929C12.5769 19.8049 12.9489 19.6729 13.4289 19.6729Z" fill="white"/>
<path d="M17.1543 18.7969L19.3023 21.7009L16.8783 25.0009H18.3783L20.0103 22.6369L21.6303 25.0009H23.1183L20.7063 21.7009L22.8543 18.7969H21.3663L20.0103 20.7649L18.6423 18.7969H17.1543Z" fill="white"/>
<path d="M26.5296 18.6289C25.6176 18.6289 24.8856 18.9409 24.3576 19.5769C23.8056 20.2009 23.5416 20.9689 23.5416 21.8929C23.5416 22.9129 23.8296 23.7169 24.4056 24.3169C24.9336 24.8809 25.6656 25.1689 26.5776 25.1689C27.4056 25.1689 28.0896 24.9289 28.6296 24.4609C29.0616 24.0769 29.3376 23.5849 29.4816 23.0089H28.2096C28.0416 23.3689 27.8616 23.6449 27.6456 23.8129C27.3696 24.0169 27.0096 24.1249 26.5656 24.1249C26.0616 24.1249 25.6656 23.9569 25.3776 23.6449C25.0896 23.3209 24.9336 22.8529 24.8856 22.2529H29.5896C29.5776 21.1489 29.3256 20.2849 28.8456 19.6609C28.3176 18.9649 27.5376 18.6289 26.5296 18.6289ZM26.5656 19.6729C27.5736 19.6729 28.1376 20.2129 28.2576 21.2929H24.9096C24.9816 20.7649 25.1616 20.3689 25.4256 20.0929C25.7136 19.8049 26.0856 19.6729 26.5656 19.6729Z" fill="white"/>
</svg>

`;
        }
        if(ext == 'mp3'){
            return  `<svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M6 2C5.44772 2 5 2.44772 5 3V37C5 37.5523 5.44772 38 6 38H34C34.5523 38 35 37.5523 35 37V11L30.5 6.5L26 2H6Z" fill="#13C2C2"/>
<path d="M35 11L27 11C26.4477 11 26 10.5523 26 10L26 2L30.5 6.5L35 11Z" fill="#5CDBD3"/>
<path d="M11.7507 18.6277C11.1267 18.6277 10.5507 18.9037 10.0467 19.4797V18.7957H8.77466V24.9997H10.0467V21.2677C10.0467 20.8357 10.1667 20.4637 10.4307 20.1637C10.6707 19.8517 11.0067 19.6957 11.4147 19.6957C12.2547 19.6957 12.6867 20.1757 12.6867 21.1597V24.9997H13.9587V21.1837C13.9587 20.7277 14.0787 20.3557 14.3187 20.0917C14.5587 19.8277 14.8467 19.6957 15.2067 19.6957C15.6867 19.6957 16.0467 19.8037 16.2627 20.0437C16.4787 20.2717 16.5867 20.6437 16.5867 21.1477V24.9997H17.8587V20.9317C17.8587 20.2357 17.6427 19.6837 17.2347 19.2637C16.8147 18.8317 16.2867 18.6277 15.6507 18.6277C15.2307 18.6277 14.8827 18.6997 14.5947 18.8557C14.2827 19.0117 13.9827 19.2877 13.7067 19.6717C13.3227 18.9757 12.6627 18.6277 11.7507 18.6277Z" fill="white"/>
<path d="M22.4061 18.6277C21.5661 18.6277 20.9181 18.9277 20.4861 19.5397V18.7957H19.2981V27.3757H20.5701V24.0877C21.0741 24.8077 21.6981 25.1677 22.4661 25.1677C23.3541 25.1677 24.0621 24.8437 24.5661 24.1957C25.0341 23.5957 25.2741 22.8397 25.2741 21.9277C25.2741 20.9677 25.0341 20.1997 24.5541 19.5997C24.0261 18.9517 23.3181 18.6277 22.4061 18.6277ZM22.2141 19.6597C22.8381 19.6597 23.2941 19.8757 23.5941 20.3317C23.8341 20.7157 23.9661 21.2437 23.9661 21.9277C23.9661 22.6117 23.8221 23.1397 23.5581 23.5237C23.2581 23.9317 22.8021 24.1357 22.1781 24.1357C21.6981 24.1357 21.3141 23.9437 21.0261 23.5717C20.6901 23.1637 20.5341 22.6237 20.5341 21.9637V21.8557C20.5341 21.2197 20.6661 20.7037 20.9301 20.3197C21.2301 19.8757 21.6621 19.6597 22.2141 19.6597Z" fill="white"/>
<path d="M29.434 16.2637C28.594 16.2637 27.91 16.4917 27.382 16.9717C26.818 17.4517 26.506 18.1117 26.434 18.9637H27.718C27.766 18.4357 27.946 18.0397 28.234 17.7757C28.522 17.5117 28.93 17.3797 29.446 17.3797C29.95 17.3797 30.346 17.4877 30.61 17.7277C30.85 17.9557 30.982 18.2797 30.982 18.7117C30.982 19.1437 30.838 19.4797 30.574 19.7077C30.31 19.9357 29.914 20.0557 29.386 20.0557H28.774V21.0397H29.398C29.962 21.0397 30.394 21.1597 30.682 21.3997C30.994 21.6397 31.15 22.0117 31.15 22.5157C31.15 22.9477 30.994 23.2957 30.706 23.5837C30.37 23.8957 29.926 24.0637 29.374 24.0637C28.87 24.0637 28.462 23.9197 28.15 23.6317C27.79 23.3197 27.61 22.8757 27.586 22.2997H26.266C26.338 23.2597 26.674 23.9917 27.274 24.4957C27.802 24.9397 28.51 25.1677 29.386 25.1677C30.298 25.1677 31.054 24.9037 31.63 24.3997C32.17 23.8957 32.446 23.2477 32.446 22.4557C32.446 21.9517 32.302 21.5317 32.014 21.2077C31.75 20.8957 31.366 20.6557 30.862 20.4997C31.798 20.1877 32.278 19.5517 32.278 18.6157C32.278 17.8837 32.014 17.3077 31.51 16.8877C30.982 16.4677 30.298 16.2637 29.434 16.2637Z" fill="white"/>
</svg>


`;
        }
        if(ext == 'ppt' || ext == 'pptx'){
            return  `<svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M6 2C5.44772 2 5 2.44772 5 3V37C5 37.5523 5.44772 38 6 38H34C34.5523 38 35 37.5523 35 37V11L30.5 6.5L26 2H6Z" fill="#FA541C"/>
<path d="M35 11L27 11C26.4477 11 26 10.5523 26 10L26 2L30.5 6.5L35 11Z" fill="#FF9C6E"/>
<path d="M15.26 15.1484V28.0004H17.366V23.0684H20.552C23.684 23.0684 25.25 21.7364 25.25 19.0904C25.25 16.4624 23.684 15.1484 20.588 15.1484H15.26ZM17.366 16.9484H20.426C21.344 16.9484 22.028 17.1104 22.46 17.4524C22.892 17.7764 23.126 18.3164 23.126 19.0904C23.126 19.8644 22.91 20.4224 22.478 20.7644C22.046 21.0884 21.362 21.2684 20.426 21.2684H17.366V16.9484Z" fill="white"/>
</svg>



`;
        }
        if(ext == 'rar'){
            return  `<svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M6 2C5.44772 2 5 2.44772 5 3V37C5 37.5523 5.44772 38 6 38H34C34.5523 38 35 37.5523 35 37V11L30.5 6.5L26 2H6Z" fill="#FA8C16"/>
<path d="M35 11L27 11C26.4477 11 26 10.5523 26 10L26 2L30.5 6.5L35 11Z" fill="#FFC069"/>
<path d="M15.7191 18.6289C15.3351 18.6289 14.9991 18.7369 14.7111 18.9769C14.4711 19.1449 14.2671 19.3969 14.1111 19.7329V18.7969H12.8391V25.0009H14.1111V21.7129C14.1111 21.1729 14.2671 20.7289 14.5911 20.3929C14.8911 20.0809 15.2391 19.9249 15.6231 19.9249C15.9111 19.9249 16.2111 19.9609 16.5231 20.0569V18.7849C16.3071 18.6769 16.0311 18.6289 15.7191 18.6289Z" fill="white"/>
<path d="M20.1 18.6289C19.332 18.6289 18.708 18.7609 18.252 19.0489C17.724 19.3609 17.388 19.8649 17.256 20.5369L18.516 20.6449C18.588 20.2969 18.768 20.0449 19.056 19.8769C19.296 19.7329 19.62 19.6609 20.016 19.6609C20.952 19.6609 21.42 20.0929 21.42 20.9569V21.2089L20.028 21.2449C19.116 21.2689 18.396 21.4489 17.892 21.8089C17.34 22.1809 17.064 22.7209 17.064 23.4169C17.064 23.9329 17.256 24.3529 17.652 24.6769C18.012 25.0009 18.516 25.1689 19.164 25.1689C19.716 25.1689 20.196 25.0609 20.604 24.8689C20.964 24.6889 21.264 24.4369 21.504 24.1249V25.0009H22.68V21.0409C22.68 20.2849 22.488 19.7089 22.116 19.3129C21.684 18.8569 21.012 18.6289 20.1 18.6289ZM21.42 22.1329V22.4929C21.42 22.9729 21.216 23.3809 20.832 23.7049C20.448 24.0289 19.992 24.1969 19.452 24.1969C19.128 24.1969 18.864 24.1129 18.672 23.9569C18.468 23.8009 18.372 23.6089 18.372 23.3689C18.372 22.6009 18.948 22.1929 20.112 22.1689L21.42 22.1329Z" fill="white"/>
<path d="M27.016 18.6289C26.632 18.6289 26.296 18.7369 26.008 18.9769C25.768 19.1449 25.564 19.3969 25.408 19.7329V18.7969H24.136V25.0009H25.408V21.7129C25.408 21.1729 25.564 20.7289 25.888 20.3929C26.188 20.0809 26.536 19.9249 26.92 19.9249C27.208 19.9249 27.508 19.9609 27.82 20.0569V18.7849C27.604 18.6769 27.328 18.6289 27.016 18.6289Z" fill="white"/>
</svg>


`;
        }
        if(ext == 'doc'||ext == 'docx'){
            return  `<svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M6 2C5.44772 2 5 2.44772 5 3V37C5 37.5523 5.44772 38 6 38H34C34.5523 38 35 37.5523 35 37V11L30.5 6.5L26 2H6Z" fill="#1890FF"/>
<path d="M35 11L27 11C26.4477 11 26 10.5523 26 10L26 2L30.5 6.5L35 11Z" fill="#69C0FF"/>
<path d="M11.09 15.1484L14.78 28.0004H17.03L19.55 18.3344H19.622L22.124 28.0004H24.356L28.064 15.1484H25.688L23.276 24.9224H23.204L20.666 15.1484H18.488L15.95 24.9224H15.878L13.466 15.1484H11.09Z" fill="white"/>
</svg>


`;
        }
        if(ext == 'mp4'){
            return  `<svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M6 2C5.44772 2 5 2.44772 5 3V37C5 37.5523 5.44772 38 6 38H34C34.5523 38 35 37.5523 35 37V11L30.5 6.5L26 2H6Z" fill="#13C2C2"/>
<path d="M35 11L27 11C26.4477 11 26 10.5523 26 10L26 2L30.5 6.5L35 11Z" fill="#5CDBD3"/>
<path d="M11.7507 18.6276C11.1267 18.6276 10.5507 18.9036 10.0467 19.4796V18.7956H8.77466V24.9996H10.0467V21.2676C10.0467 20.8356 10.1667 20.4636 10.4307 20.1636C10.6707 19.8516 11.0067 19.6956 11.4147 19.6956C12.2547 19.6956 12.6867 20.1756 12.6867 21.1596V24.9996H13.9587V21.1836C13.9587 20.7276 14.0787 20.3556 14.3187 20.0916C14.5587 19.8276 14.8467 19.6956 15.2067 19.6956C15.6867 19.6956 16.0467 19.8036 16.2627 20.0436C16.4787 20.2716 16.5867 20.6436 16.5867 21.1476V24.9996H17.8587V20.9316C17.8587 20.2356 17.6427 19.6836 17.2347 19.2636C16.8147 18.8316 16.2867 18.6276 15.6507 18.6276C15.2307 18.6276 14.8827 18.6996 14.5947 18.8556C14.2827 19.0116 13.9827 19.2876 13.7067 19.6716C13.3227 18.9756 12.6627 18.6276 11.7507 18.6276Z" fill="white"/>
<path d="M22.4061 18.6276C21.5661 18.6276 20.9181 18.9276 20.4861 19.5396V18.7956H19.2981V27.3756H20.5701V24.0876C21.0741 24.8076 21.6981 25.1676 22.4661 25.1676C23.3541 25.1676 24.0621 24.8436 24.5661 24.1956C25.0341 23.5956 25.2741 22.8396 25.2741 21.9276C25.2741 20.9676 25.0341 20.1996 24.5541 19.5996C24.0261 18.9516 23.3181 18.6276 22.4061 18.6276ZM22.2141 19.6596C22.8381 19.6596 23.2941 19.8756 23.5941 20.3316C23.8341 20.7156 23.9661 21.2436 23.9661 21.9276C23.9661 22.6116 23.8221 23.1396 23.5581 23.5236C23.2581 23.9316 22.8021 24.1356 22.1781 24.1356C21.6981 24.1356 21.3141 23.9436 21.0261 23.5716C20.6901 23.1636 20.5341 22.6236 20.5341 21.9636V21.8556C20.5341 21.2196 20.6661 20.7036 20.9301 20.3196C21.2301 19.8756 21.6621 19.6596 22.2141 19.6596Z" fill="white"/>
<path d="M30.214 16.4316L25.99 21.9036V23.1396H30.166V24.9996H31.414V23.1396H32.71V22.0956H31.414V16.4316H30.214ZM30.13 18.0876H30.166V22.0956H27.058L30.13 18.0876Z" fill="white"/>
</svg>

`;
        }
        if(ext == 'bmp'){
            return  `<svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M6 2C5.44772 2 5 2.44772 5 3V37C5 37.5523 5.44772 38 6 38H34C34.5523 38 35 37.5523 35 37V11L30.5 6.5L26 2H6Z" fill="#597EF7"/>
<path d="M35 11L27 11C26.4477 11 26 10.5523 26 10L26 2L30.5 6.5L35 11Z" fill="#85A5FF"/>
<path d="M7.84003 16.4316V24.9996H11.752C12.664 24.9996 13.372 24.8316 13.876 24.4956C14.464 24.0876 14.764 23.4636 14.764 22.5996C14.764 22.0236 14.62 21.5556 14.332 21.2076C14.044 20.8596 13.612 20.6316 13.048 20.5236C13.48 20.3676 13.804 20.1276 14.044 19.8156C14.284 19.4796 14.404 19.0716 14.404 18.5916C14.404 17.9316 14.176 17.4156 13.72 17.0316C13.24 16.6236 12.592 16.4316 11.752 16.4316H7.84003ZM9.14803 17.5116H11.428C12.004 17.5116 12.436 17.6076 12.7 17.8116C12.964 18.0036 13.096 18.3156 13.096 18.7476C13.096 19.2036 12.964 19.5396 12.7 19.7556C12.436 19.9596 12.004 20.0676 11.404 20.0676H9.14803V17.5116ZM9.14803 21.1356H11.608C12.232 21.1356 12.7 21.2436 13 21.4716C13.3 21.6996 13.456 22.0716 13.456 22.5756C13.456 23.0676 13.252 23.4276 12.868 23.6556C12.556 23.8236 12.124 23.9196 11.572 23.9196H9.14803V21.1356Z" fill="white"/>
<path d="M16.0783 16.4316V24.9996H17.3863V18.8796H17.4343L20.0623 24.9996H21.1903L23.8183 18.8796H23.8663V24.9996H25.1743V16.4316H23.6263L20.6503 23.2956H20.6143L17.6263 16.4316H16.0783Z" fill="white"/>
<path d="M26.8596 16.4316V24.9996H28.1676V21.6636H30.3876C32.4396 21.6636 33.4716 20.7876 33.4716 19.0356C33.4716 17.2956 32.4516 16.4316 30.4116 16.4316H26.8596ZM28.1676 17.5476H30.3036C30.9396 17.5476 31.4076 17.6676 31.7076 17.9076C32.0076 18.1236 32.1636 18.5076 32.1636 19.0356C32.1636 19.5636 32.0076 19.9476 31.7196 20.1876C31.4196 20.4276 30.9516 20.5476 30.3036 20.5476H28.1676V17.5476Z" fill="white"/>
</svg>

`;
        }
        if(ext == 'xls' ||ext == 'xlsx' ){
            return  `<svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M6 2C5.44772 2 5 2.44772 5 3V37C5 37.5523 5.44772 38 6 38H34C34.5523 38 35 37.5523 35 37V11L30.5 6.5L26 2H6Z" fill="#52C41A"/>
<path d="M35 11L27 11C26.4477 11 26 10.5523 26 10L26 2L30.5 6.5L35 11Z" fill="#95DE64"/>
<path d="M14.378 15.1484L18.68 21.3584L14.09 28.0004H16.664L19.976 23.0324L23.288 28.0004H25.862L21.236 21.3584L25.574 15.1484H23L19.976 19.6844L16.952 15.1484H14.378Z" fill="white"/>
</svg>

`;
        }

        return `<svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M6 2C5.44772 2 5 2.44772 5 3V37C5 37.5523 5.44772 38 6 38H34C34.5523 38 35 37.5523 35 37V11L30.5 6.5L26 2H6Z" fill="#BFBFBF"/>
<path d="M35 11L27 11C26.4477 11 26 10.5523 26 10L26 2L30.5 6.5L35 11Z" fill="#D9D9D9"/>
<rect x="13" y="17" width="14" height="2" fill="white"/>
<rect x="13" y="23" width="8" height="2" fill="white"/>
</svg>

`
    },
    getExt(name){
        if(!name){
            return '';
        }
        let split_name = name.split('.');
        let ext = split_name[split_name.length-1];
        return ext.toLowerCase();
    }

}