let audio = document.querySelector('.quran-player'),
    surahContainer = document.querySelector('.surah'),
    ayah = document.querySelector('.ayah'),
    next = document.querySelector('.next'),
    play = document.querySelector('.play'),
    previous = document.querySelector('.previous');

getSurah();

function getSurah() {
    fetch('https://api.quran.sutanlab.id/surah')
        .then(response => response.json())
        .then(data => {

            for (let surah in data.data) {
                surahContainer.innerHTML +=
                    `
                    <div>
                        <p>${data.data[surah].name.long}</p>
                        <p>${data.data[surah].name.transliteration.en}</p>
                    </div>
                `;
            }

            let all = document.querySelectorAll('.surah div'),
                ayatAudio,
                ayatText;

            all.forEach((surah, index) => {
                surah.addEventListener('click', () => {
                    fetch(`https://api.quran.sutanlab.id/surah/${index + 1}`)
                        .then(response => response.json())
                        .then(data => {
                            let verses = data.data.verses;
                            ayatAudio = [];
                            ayatText = [];
                            verses.forEach(verses => {
                                ayatAudio.push(verses.audio.primary);
                                ayatText.push(verses.text.arab);
                            });

                            let ayahIndex = 0;
                            changeAyahIndex(ayahIndex);
                            audio.addEventListener('ended', () => {
                                ayahIndex++;

                                if (ayahIndex < ayatAudio.length) {
                                    changeAyahIndex(ayahIndex);
                                } else {
                                    ayahIndex = 0;
                                    changeAyahIndex(ayahIndex);
                                    audio.pause();

                                    Swal.fire({
                                        position: 'center',
                                        icon: 'success',
                                        title: 'نهاية السورة',
                                        showConfirmButton: false,
                                        timer: 3000
                                    });
                                    isPlaying = true;
                                    toggle();
                                }
                            });

                            // Next Button
                            next.addEventListener('click', () => {
                                ayahIndex < ayatAudio.length - 1 ? ayahIndex++ : ayahIndex = 0;
                                changeAyahIndex(ayahIndex);
                                isPlaying = false;
                            });

                            // Previous Button
                            previous.addEventListener('click', () => {
                                ayahIndex == 0 ? ayahIndex = ayatAudio.length - 1 : ayahIndex--;
                                changeAyahIndex(ayahIndex);
                                isPlaying = false;
                            });

                            // Play Button
                            let isPlaying = false;
                            toggle();

                            function toggle() {
                                if (isPlaying) {
                                    audio.pause();
                                    play.innerHTML =
                                        `<i class="fa-solid fa-play"></i>`;
                                    isPlaying = false;
                                } else {
                                    audio.play();
                                    play.innerHTML =
                                        `<i class="fa-solid fa-pause"></i>`;
                                    isPlaying = true;
                                }
                            }

                            play.addEventListener('click', toggle);

                            function changeAyahIndex(index) {
                                audio.src = ayatAudio[index];
                                ayah.innerHTML = ayatText[index];
                            }

                        });
                });
            });
        });
}