<template>
    <v-card class="rounded" hover
        :ripple="{ class: 'primary--text' }"
        :to="`stands/${item.id}`"
        height="100%"
    >
        <v-img
            v-if="!item.products.length"
            src="/assets/stand_placeholder.jpg"
            height="100"
        ></v-img>
        <v-carousel
            v-else
            :interval="2000"
            hide-delimiters
            hide-controls
            height="100"
        >
            <v-carousel-item
                v-for="(item, i) in item.products"
                :key="`prd-${item.id}-${i}`"
                :src="item.image"
            ></v-carousel-item>
        </v-carousel>
        <v-card-title class="title">
            {{ item.stand_name }}
        </v-card-title>
        <v-card-text class="grey--text text--darken-2 pt-0 stand-desc">
            {{ item.description }}
        </v-card-text>
        <v-card-text class="subheading accent--text">
            {{ item.products.length }} MENU
        </v-card-text>
    </v-card>
</template>
<script>
export default {
    props: {
        item: {
            type: Object,
            required: true,
        }
    }
}
</script>

<style lang="scss" scoped>
    .stand-desc {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
</style>