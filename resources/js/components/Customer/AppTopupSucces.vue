<template>
    <v-container grid-list-lg>
        <v-layout class="my-5" row wrap justify-center>
            <span>
                <svg class="checkmark" viewBox="0 0 52 52"><circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/><path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>
            </span>
            <v-flex xs12 class="mt-4">
                <p class="title text-xs-center">Top Up Berhasil!</p>
            </v-flex>
            <v-flex xs12>
                <p class="subheading text-xs-center">Saldo anda</p>
                <p class="display-1 text-xs-center primary--text font-weight-bold">{{ $rupiahFormat($user.info().balance) }}</p>
            </v-flex>
            <v-flex xs12 class="text-xs-center mt-4">
                <v-btn
                    color="primary"
                    large round
                    @click="$router.replace('/')"
                >
                    ke beranda
                </v-btn>
            </v-flex>
        </v-layout>
        <div class="ma-5 d-flex" row wrap justify-center>
        </div>
    </v-container>
</template>

<script>
export default {
    
}
</script>

<style lang="scss" scoped>
    // Colors
    $green: #7ac142;
    $white: #fff;

    // Misc
    $curve: cubic-bezier(0.650, 0.000, 0.450, 1.000);

    .checkmark {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        display: block;
        stroke-width: 2;
        stroke: $white;
        stroke-miterlimit: 10;
        box-shadow: inset 0px 0px 0px $green;
        animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
    }

    .checkmark__circle {
        stroke-dasharray: 166;
        stroke-dashoffset: 166;
        stroke-width: 2;
        stroke-miterlimit: 10;
        stroke: $green;
        fill: none;
        animation: stroke .6s $curve forwards;
    }

    .checkmark__check {
        transform-origin: 50% 50%;
        stroke-dasharray: 48;
        stroke-dashoffset: 48;
        animation: stroke .3s $curve .8s forwards;
    }

    @keyframes stroke {
        100% {
            stroke-dashoffset: 0;
        }
    }

    @keyframes scale {
        0%, 100% {
            transform: none;
        }
        50% {
            transform: scale3d(1.1, 1.1, 1);
        }
    }

    @keyframes fill {
        100% {
            box-shadow: inset 0px 0px 0px 30px $green;
        }
    }
</style>