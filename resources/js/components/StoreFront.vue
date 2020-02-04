<template>
    <div>
        <div style="height: 20vh" class="pa-3">
            <v-img
                src="/assets/logo-pkwu.png"
                contain
                position="center right"
                height="80%"
                @click="$router.push('/')"
            ></v-img>
        </div>
        <div style="height: 80vh">
            <v-layout
                row wrap align-center style="height: 80%"
                fill-height 
                v-if="isLoading"
            >
                <v-flex xs12 class="text-xs-center">
                    <v-progress-circular
                        :size="100"
                        :width="7"
                        color="primary"
                        indeterminate
                    ></v-progress-circular>
                </v-flex>
            </v-layout>
            <v-layout 
                row wrap justify-center align-content-center 
                fill-height style="height: 75%" v-else
            >
                <v-flex xs12 md5>
                    <carousel-3d
                        :autoplay="true"
                        :autoplayHoverPause="true"
                        :autoplayTimeout="4000"
                        :clickable="false"
                        display="5"
                        border="0"
                        width="650"
                        height="500"
                        @before-slide-change="getRandomMenu"
                    >
                        <slide 
                            v-for="(item, i) in listDisplayed" 
                            :key="`slide-${i}`"
                            :index="i"
                            class="rounded"
                        >
                            <img :src="item.image" :alt="item.name">
                        </slide>
                    </carousel-3d>
                </v-flex>
                <v-flex xs12 md7 class="pl-5">
                    <v-layout
                        row wrap
                        align-content-center
                        class="pl-3"
                        style="height: 100%"
                    >
                        <v-flex xs12 class="mb-3">
                            <div class="display-4 font-weight-black orange--text text--darken-1">
                                {{ getCurrentItem.name }}
                            </div>
                            <div class="display-3 font-weight-black grey--text text--darken-2">
                                {{ $rupiahFormat(getCurrentItem.price) }}
                            </div>
                        </v-flex>
                        <template v-if="getCurrentItem.units > 0">
                            <v-flex xs12 class="mb-4">
                                <h1 class="display-1 grey--text text--darken-2 font-weight-medium">
                                    Stand {{ getCurrentItem.stand.stand_name }}
                                </h1>
                            </v-flex>
                            <v-flex xs12>
                                <h1 class="display-1 grey--text text--darken-1">
                                    {{ getCurrentItem.units }} tersisa
                                </h1>
                            </v-flex>
                        </template>
                        <template v-else>
                            <v-flex xs12 class="mb-4">
                                <h1 class="display-2 red--text font-weight-bold">
                                    Habis!
                                </h1>
                            </v-flex>
                        </template>
                    </v-layout>
                </v-flex>
            </v-layout>
        </div>
    </div>
</template>
<script>
import { Carousel3d, Slide } from 'vue-carousel-3d';

export default {
    components: {
        Carousel3d,
        Slide
    },
    data: () => ({
        isLoading: true,
        listAll: [],
        listDisplayed: [],
        currentIndex: 0,
    }),
    computed: {
        getCurrentItem() {
            return this.listDisplayed[this.currentIndex];
        }
    },
    methods: {
        getRandomMenu(index) {
            this.currentIndex = index;
            // pick random menu from list and swap it
            this.currentIndex = index;
            if(this.listAll.length > 0) {
                const rand = Math.floor(Math.random() * this.listAll.length);
                // unseenIdx: index of a slide that is still invisible/unseen
                const unseenIdx = (this.currentIndex + Math.floor(this.listDisplayed.length/2)) % this.listDisplayed.length;
                const currentUnseen = this.listDisplayed[unseenIdx];
                const swapped = this.listAll.splice(rand, 1, currentUnseen);
                this.listDisplayed[unseenIdx] = swapped[0];
                console.log("currentFUnseen: " + this.unseenIdx);
            }
        },
    },
    mounted() {
        axios.get('/api/products/all')
        .then(res => {
            this.isLoading = false;
            this.listAll = res.data;
            for(let i=0; i<7; i++) {
                if(this.listAll <= 0) break;
                const rand = Math.floor(Math.random() * this.listAll.length);
                this.listDisplayed.push(res.data[rand]);
                this.listAll.splice(rand, 1);
                console.log(this.listAll)
            }
        })
        .catch(err => {
            this.isLoading = false;
            const code = err.response.status;
            swal({
                title: "Oops!",
                text: `Error ${code}.`,
                icon: "error",
            });
        });
    },
}
</script>